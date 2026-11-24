export const FILE_SCAN_PYTHON_CODE = `#!/usr/bin/env python3
"""FileScan — local file security scanner.

Inspects a single file or an entire folder: magic byte signatures, SHA-256
hashes, Shannon entropy, and deceptive patterns (double extensions, executables
disguised as documents, Office macros, suspicious embedded strings).

Uploads nothing. Uses only the Python 3.9+ standard library.

Examples:
  python file_scan.py ~/Downloads
  python file_scan.py ~/Downloads --suspicious-only
  python file_scan.py ~/Downloads --json report.json --strict
  python file_scan.py ~/Downloads --json -
"""

from __future__ import annotations

import argparse
import hashlib
import json
import math
import os
import stat
import sys
from datetime import datetime, timezone
from pathlib import Path

ANALYSIS_WINDOW = 65_536
MAX_HASH_BYTES = 2 * 1024 * 1024 * 1024
MAX_FINDINGS = 8

DANGEROUS_EXT = {
    "exe", "dll", "scr", "com", "pif", "bat", "cmd", "ps1", "vbs", "vbe",
    "js", "jse", "wsf", "wsh", "msi", "hta", "reg", "lnk", "iso", "img",
    "dmg", "apk", "jar", "sys",
}
SCRIPT_EXT = {
    "js", "mjs", "cjs", "py", "sh", "bash", "php", "rb", "pl", "ps1", "vbs",
    "bat", "cmd",
}
MACRO_EXT = {"docm", "dotm", "xlsm", "xltm", "pptm", "potm", "xlsb"}
SAFE_LOOKING = {
    "pdf", "doc", "docx", "xls", "xlsx", "ppt", "pptx", "txt", "rtf", "csv",
    "jpg", "jpeg", "png", "gif", "webp", "bmp", "mp3", "mp4", "wav", "mov",
    "odt", "ods", "odp", "svg", "html", "htm",
}
COMPRESSED_EXT = {
    "zip", "rar", "7z", "gz", "bz2", "xz", "tgz", "jpg", "jpeg", "png",
    "webp", "gif", "mp3", "mp4", "mov", "avi", "mkv", "webm", "pdf", "docx",
    "xlsx", "pptx", "odt", "jar", "apk", "wasm", "woff", "woff2", "ogg",
    "opus",
}
NATIVE_EXT = {"exe", "dll", "scr", "sys", "so", "elf", "dylib", "com"}
DENSE_MAGIC = {
    "PNG", "JPEG", "GIF", "WEBP", "MP4", "MP3", "GZIP", "ZIP", "RAR", "7Z",
    "WAV", "WASM", "PDF", "AVI",
}
EXEC_MAGIC = {"PE", "ELF", "MACHO"}

EXT_EXPECTS: dict[str, set[str]] = {
    "pdf": {"PDF"},
    "png": {"PNG"},
    "jpg": {"JPEG"},
    "jpeg": {"JPEG"},
    "gif": {"GIF"},
    "webp": {"WEBP"},
    "zip": {"ZIP"},
    "docx": {"ZIP"},
    "xlsx": {"ZIP"},
    "pptx": {"ZIP"},
    "odt": {"ZIP"},
    "jar": {"ZIP"},
    "apk": {"ZIP"},
    "docm": {"ZIP"},
    "xlsm": {"ZIP"},
    "pptm": {"ZIP"},
    "exe": {"PE"},
    "dll": {"PE"},
    "scr": {"PE"},
    "sys": {"PE"},
    "com": {"PE"},
    "so": {"ELF"},
    "elf": {"ELF"},
    "dylib": {"MACHO"},
    "gz": {"GZIP"},
    "mp3": {"MP3"},
    "wav": {"WAV"},
    "bmp": {"BMP"},
    "wasm": {"WASM"},
    "mp4": {"MP4"},
    "mov": {"MP4"},
    "m4v": {"MP4"},
    "class": {"CLASS"},
    "sqlite": {"SQLITE"},
    "db": {"SQLITE"},
    "html": {"HTML"},
    "htm": {"HTML"},
    "xml": {"XML"},
    "svg": {"SVG", "XML"},
    "rar": {"RAR"},
    "7z": {"7Z"},
    "avi": {"AVI"},
    "doc": {"OLE"},
    "xls": {"OLE"},
    "ppt": {"OLE"},
}

NEEDLES: list[tuple[str, str]] = [
    ("powershell", "PowerShell reference"),
    ("invoke-expression", "Invoke-Expression"),
    ("frombase64string", "Base64 decode call"),
    ("wscript.shell", "Windows Script Host"),
    ("regsvr32", "regsvr32"),
    ("cmd.exe", "cmd.exe reference"),
    ("/javascript", "Embedded JavaScript"),
    ("<?php", "Embedded PHP code"),
    ("<script", "Embedded script tag"),
    ("#!/bin/", "Shebang header"),
]

SIGNATURES: list[tuple[bytes, str]] = [
    (b"\\x89PNG\\r\\n\\x1a\\n", "PNG"),
    (b"\\xff\\xd8\\xff", "JPEG"),
    (b"GIF87a", "GIF"),
    (b"GIF89a", "GIF"),
    (b"%PDF", "PDF"),
    (b"PK\\x03\\x04", "ZIP"),
    (b"PK\\x05\\x06", "ZIP"),
    (b"PK\\x07\\x08", "ZIP"),
    (b"Rar!\\x1a\\x07", "RAR"),
    (b"7z\\xbc\\xaf'\\x1c", "7Z"),
    (b"\\x1f\\x8b", "GZIP"),
    (b"\\x7fELF", "ELF"),
    (b"MZ", "PE"),
    (b"\\xfe\\xed\\xfa\\xce", "MACHO"),
    (b"\\xfe\\xed\\xfa\\xcf", "MACHO"),
    (b"\\xce\\xfa\\xed\\xfe", "MACHO"),
    (b"\\xcf\\xfa\\xed\\xfe", "MACHO"),
    (b"ID3", "MP3"),
    (b"\\x00asm", "WASM"),
    (b"SQLite format 3\\x00", "SQLITE"),
    (b"\\xca\\xfe\\xba\\xbe", "CLASS"),
    (b"\\xd0\\xcf\\x11\\xe0", "OLE"),
]


def extensions_of(name: str) -> list[str]:
    base = name.replace("\\\\", "/").rsplit("/", 1)[-1]
    parts = base.split(".")
    if len(parts) < 2 or not parts[0]:
        return []
    return [part.lower() for part in parts[1:] if part]


def looks_text(head: bytes) -> bool:
    sample = head[:1024]
    if not sample or b"\\x00" in sample:
        return False
    try:
        text = sample.decode("utf-8")
    except UnicodeDecodeError:
        return False
    ok = sum(1 for ch in text if ch.isprintable() or ch in "\\n\\r\\t")
    return ok / max(len(text), 1) > 0.92


def classify(head: bytes) -> str:
    if len(head) >= 12 and head[4:8] == b"ftyp":
        return "MP4"
    if head.startswith(b"BM") and len(head) >= 10 and head[6:10] == b"\\x00\\x00\\x00\\x00":
        return "BMP"
    for prefix, label in SIGNATURES:
        if head.startswith(prefix):
            return label
    if len(head) >= 12 and head.startswith(b"RIFF"):
        kind = head[8:12]
        if kind == b"WAVE":
            return "WAV"
        if kind == b"WEBP":
            return "WEBP"
        if kind == b"AVI ":
            return "AVI"
        return "RIFF"
    if len(head) >= 2 and head[0] == 0xFF and (head[1] & 0xE0) == 0xE0:
        return "MP3"
    stripped = head.lstrip(b"\\xef\\xbb\\xbf \\t\\r\\n")
    lower = stripped[:64].lower()
    if lower.startswith(b"<!doctype html") or lower.startswith(b"<html"):
        return "HTML"
    if lower.startswith(b"<?xml"):
        return "XML"
    if lower.startswith(b"<svg"):
        return "SVG"
    if looks_text(head):
        return "TEXT"
    return "UNKNOWN"


def shannon(data: bytes) -> float:
    sample = data[:ANALYSIS_WINDOW]
    if not sample:
        return 0.0
    counts = [0] * 256
    for byte in sample:
        counts[byte] += 1
    total = len(sample)
    entropy = 0.0
    for count in counts:
        if not count:
            continue
        p = count / total
        entropy -= p * math.log2(p)
    return entropy


def finding(severity: str, title: str, detail: str) -> dict[str, str]:
    return {"severity": severity, "title": title, "detail": detail}


def verdict_of(findings: list[dict[str, str]]) -> str:
    if any(item["severity"] == "alert" for item in findings):
        return "alert"
    if any(item["severity"] == "caution" for item in findings):
        return "caution"
    return "clean"


def analyze(name: str, size: int, head: bytes, partial: bool) -> tuple[str, float, list[dict[str, str]]]:
    exts = extensions_of(name)
    ext = exts[-1] if exts else ""
    magic = classify(head) if size else "EMPTY"
    entropy = round(shannon(head), 2)
    findings: list[dict[str, str]] = []

    if size == 0:
        findings.append(finding("caution", "Empty file", "File size is 0 bytes."))
    if "\\u202e" in name or "\\u202d" in name:
        findings.append(finding(
            "alert",
            "Bidirectional override character",
            "Filename contains Unicode control characters that can spoof extensions on screen.",
        ))
    if len(name) > 180:
        findings.append(finding("caution", "Unusually long filename", f"{len(name)} characters."))
    if len(exts) >= 2 and exts[-2] in SAFE_LOOKING and ext in DANGEROUS_EXT | SCRIPT_EXT:
        findings.append(finding(
            "alert",
            "Double extension",
            f"Name ends with .{exts[-2]}.{ext}. Commonly used to disguise executables as documents.",
        ))
    if ext in MACRO_EXT:
        findings.append(finding(
            "alert",
            "Macro-enabled document",
            f"The .{ext} extension can contain macros that execute when opened.",
        ))
    expected = EXT_EXPECTS.get(ext)
    if size > 0 and magic in EXEC_MAGIC and ext not in NATIVE_EXT:
        findings.append(finding(
            "alert",
            "Disguised executable",
            f"Content matches {magic} binary header, but the extension is not an executable.",
        ))
    elif expected and size > 0 and magic not in {"UNKNOWN", "EMPTY"} and magic not in expected:
        findings.append(finding(
            "caution",
            "Content mismatches extension",
            f"Extension .{ext} typically expects {'/'.join(sorted(expected))}, detected {magic}.",
        ))
    elif expected and size > 16 and magic == "UNKNOWN":
        findings.append(finding(
            "caution",
            "Unrecognized content header",
            f"Extension .{ext} expects {'/'.join(sorted(expected))}, but magic bytes do not match.",
        ))
    if (
        entropy > 7.2
        and size > 256
        and magic not in DENSE_MAGIC
        and ext not in COMPRESSED_EXT
    ):
        findings.append(finding(
            "caution",
            "High entropy",
            f"Entropy {entropy:.2f}/8 in the first 64 KB. Content appears random — packed or encrypted.",
        ))
    if ext not in SCRIPT_EXT and size > 0:
        haystack = head[:ANALYSIS_WINDOW].decode("latin-1", errors="ignore").lower()
        for needle, title in NEEDLES:
            if needle not in haystack:
                continue
            if needle == "<script" and ext in {"html", "htm", "svg", "xml"}:
                continue
            if needle == "<?php" and ext == "php":
                continue
            severity = "alert" if ext in SAFE_LOOKING or ext in MACRO_EXT or ext == "" else "caution"
            findings.append(finding(
                severity,
                title,
                f"Matched pattern “{needle}” within the first {min(size, ANALYSIS_WINDOW)} bytes.",
            ))
            if len(findings) >= MAX_FINDINGS:
                break
    if partial:
        findings.append(finding(
            "note",
            "Hash skipped",
            "File exceeds 2 GB. Inspected leading bytes only without full hashing.",
        ))
    return magic, entropy, findings[:MAX_FINDINGS]


def empty_record(path: str, size: int, magic: str, findings: list[dict[str, str]]) -> dict:
    return {
        "path": path,
        "size": size,
        "extension": (extensions_of(path) or [""])[-1],
        "magic": magic,
        "entropy": 0,
        "partial": False,
        "hashes": None,
        "verdict": verdict_of(findings),
        "findings": findings,
    }


def scan_file(path: Path, root: Path) -> dict:
    rel = str(path)
    try:
        rel = str(path.relative_to(root)) if path.is_relative_to(root) else str(path)
    except ValueError:
        rel = str(path)
    try:
        st = path.lstat()
    except OSError as exc:
        return empty_record(rel, 0, "UNKNOWN", [
            finding("caution", "Unreadable file", str(exc)),
        ])
    if stat.S_ISLNK(st.st_mode):
        return empty_record(rel, st.st_size, "SYMLINK", [
            finding("caution", "Symbolic link", "Links are not followed. Inspect the target separately."),
        ])
    if not stat.S_ISREG(st.st_mode):
        return empty_record(rel, st.st_size, "SPECIAL", [
            finding("note", "Non-regular file", "Sockets, pipes, and device nodes are skipped."),
        ])

    partial = st.st_size > MAX_HASH_BYTES
    head = b""
    hashes = None
    try:
        if partial:
            with path.open("rb") as handle:
                head = handle.read(ANALYSIS_WINDOW)
        else:
            md5, sha1, sha256 = hashlib.md5(), hashlib.sha1(), hashlib.sha256()
            with path.open("rb") as handle:
                while True:
                    block = handle.read(1024 * 1024)
                    if not block:
                        break
                    if len(head) < ANALYSIS_WINDOW:
                        head += block[: ANALYSIS_WINDOW - len(head)]
                    md5.update(block)
                    sha1.update(block)
                    sha256.update(block)
            hashes = {
                "md5": md5.hexdigest(),
                "sha1": sha1.hexdigest(),
                "sha256": sha256.hexdigest(),
            }
    except OSError as exc:
        return empty_record(rel, st.st_size, "UNKNOWN", [
            finding("caution", "Unreadable file", str(exc)),
        ])

    magic, entropy, findings = analyze(path.name, st.st_size, head, partial)
    record = empty_record(rel, st.st_size, magic, findings)
    record["entropy"] = entropy
    record["partial"] = partial
    record["hashes"] = hashes
    record["verdict"] = verdict_of(findings)
    return record


def iter_files(target: Path, ignored: set[str], limit: int) -> tuple[list[Path], bool]:
    if target.is_file() or target.is_symlink():
        return [target], False
    found: list[Path] = []
    truncated = False
    for dirpath, dirnames, filenames in os.walk(target, followlinks=False):
        dirnames[:] = sorted(name for name in dirnames if name not in ignored)
        for name in sorted(filenames):
            found.append(Path(dirpath) / name)
            if len(found) >= limit:
                return found, True
    return found, truncated


def format_size(size: int) -> str:
    if size < 1024:
        return f"{size} B"
    value = size / 1024
    for unit in ("KB", "MB", "GB", "TB"):
        if value < 1024 or unit == "TB":
            digits = 0 if value >= 10 else 1
            return f"{value:.{digits}f} {unit}"
        value /= 1024
    return f"{size} B"


def print_human(report: dict, only_flagged: bool) -> None:
    summary = report["summary"]
    print(
        f"FileScan  ·  {summary['files']} files  ·  "
        f"{summary['flagged']} flagged  ·  {format_size(summary['bytes'])}"
    )
    print(f"target  {report['target']}")
    shown = 0
    for item in report["files"]:
        if only_flagged and item["verdict"] == "clean":
            continue
        shown += 1
        label = {"alert": "alert", "caution": "caution", "clean": "clean"}[item["verdict"]]
        print()
        print(f"[{label}] {item['path']}")
        print(f"  size     {format_size(item['size'])}")
        print(f"  type     {item['magic']}")
        print(f"  entropy  {item['entropy']:.2f}")
        hashes = item.get("hashes") or {}
        if hashes.get("sha256"):
            print(f"  sha256   {hashes['sha256']}")
        if hashes.get("md5"):
            print(f"  md5      {hashes['md5']}")
        for found in item["findings"]:
            mark = {"alert": "!", "caution": "?", "note": "-"}[found["severity"]]
            print(f"  {mark} {found['title']} — {found['detail']}")
    if shown == 0:
        print()
        print("No files require attention.")
    if report["truncated"]:
        print()
        print(f"Stopped at {summary['files']}-file limit. Increase with --limit.")


def build_report(target: Path, ignored: set[str], limit: int) -> dict:
    root = target if target.is_dir() else target.parent
    files, truncated = iter_files(target, ignored, limit)
    records = []
    seen: dict[str, str] = {}
    for index, path in enumerate(files, start=1):
        if index == 1 or index % 200 == 0:
            print(f"… {index}", file=sys.stderr)
        record = scan_file(path, root)
        digest = (record.get("hashes") or {}).get("sha256")
        if digest:
            previous = seen.get(digest)
            if previous:
                record["findings"].append(finding(
                    "note",
                    "Duplicate hash",
                    f"Same SHA-256 digest as {previous}.",
                ))
                record["verdict"] = verdict_of(record["findings"])
            else:
                seen[digest] = record["path"]
        records.append(record)
    order = {"alert": 0, "caution": 1, "clean": 2}
    records.sort(key=lambda item: (order[item["verdict"]], item["path"]))
    flagged = sum(1 for item in records if item["verdict"] != "clean")
    alerts = sum(1 for item in records if item["verdict"] == "alert")
    return {
        "scanner": "file_scan",
        "scannedAt": datetime.now(timezone.utc).isoformat(),
        "target": str(target),
        "truncated": truncated,
        "summary": {
            "files": len(records),
            "flagged": flagged,
            "alerts": alerts,
            "bytes": sum(item["size"] for item in records),
        },
        "files": records,
    }


def parse_args(argv: list[str]) -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        prog="file_scan.py",
        description="Scan files or folders and report suspicious patterns.",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="Read-only scan. No files are modified or uploaded.",
    )
    parser.add_argument("target", help="target file or folder")
    parser.add_argument("--json", metavar="FILE", help="write JSON report (use - for stdout)")
    parser.add_argument("--suspicious-only", action="store_true", help="hide clean files in text output")
    parser.add_argument("--strict", action="store_true", help="exit with code 2 when alerts are found")
    parser.add_argument("--ignore", default=".git,node_modules,__pycache__,.venv", help="comma-separated folders to skip")
    parser.add_argument("--limit", type=int, default=5000, help="maximum file count (default 5000)")
    return parser.parse_args(argv)


def main(argv: list[str] | None = None) -> int:
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8")
        sys.stderr.reconfigure(encoding="utf-8")
    args = parse_args(sys.argv[1:] if argv is None else argv)
    target = Path(args.target).expanduser()
    if not target.exists():
        print(f"not found: {target}", file=sys.stderr)
        return 1
    ignored = {part.strip() for part in args.ignore.split(",") if part.strip()}
    report = build_report(target, ignored, max(args.limit, 1))
    payload = json.dumps(report, ensure_ascii=False, indent=2)
    if args.json == "-":
        print(payload)
    else:
        print_human(report, args.suspicious_only)
        if args.json:
            Path(args.json).write_text(payload + "\\n", encoding="utf-8")
            print()
            print(f"JSON written to {args.json}")
    if args.strict and report["summary"]["alerts"]:
        return 2
    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except KeyboardInterrupt:
        print("cancelled", file=sys.stderr)
        raise SystemExit(130) from None`;

export const FILE_SCAN_LINES: string[] = FILE_SCAN_PYTHON_CODE.split("\n");
