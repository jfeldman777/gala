#!/usr/bin/env python3
"""Build changes.json from git history of markdown pages (for «Что нового»)."""

from __future__ import annotations

import json
import re
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parent
DAYS = 90  # keep enough history; UI filters by X days


def title_from_md(path: str) -> str:
    name = Path(path).name
    if name.lower().endswith(".md"):
        name = name[:-3]
    name = re.sub(r"@$", "", name)
    name = re.sub(r"^\d+(?:\.\d+)*(?:-\d+(?:\.\d+)*)?\.?\s*", "", name)
    return name.strip() or path


def decode_git_path(raw: str) -> str:
    """Decode git's quoted octal paths like \"5. \\320\\244...\"."""
    s = raw.strip()
    if len(s) >= 2 and s[0] == '"' and s[-1] == '"':
        s = s[1:-1]
        out = bytearray()
        i = 0
        while i < len(s):
            if s[i] == "\\" and i + 3 < len(s) and s[i + 1] in "01234567":
                out.append(int(s[i + 1 : i + 4], 8))
                i += 4
            elif s[i] == "\\" and i + 1 < len(s):
                esc = s[i + 1]
                out.extend({"n": b"\n", "t": b"\t", '"': b'"', "\\": b"\\"}.get(esc, esc.encode()))
                i += 2
            else:
                out.extend(s[i].encode("utf-8", errors="surrogateescape"))
                i += 1
        return out.decode("utf-8")
    return s.replace("\\", "/")


def run_git(*args: str) -> str:
    return subprocess.check_output(
        ["git", "-c", "core.quotepath=false", *args],
        cwd=ROOT,
        text=True,
        encoding="utf-8",
    )


def main() -> None:
    pages = json.loads((ROOT / "pages.json").read_text(encoding="utf-8"))["pages"]
    by_md = {p["md"].replace("\\", "/"): p for p in pages}

    log = run_git(
        "log",
        f"--since={DAYS} days ago",
        "--name-status",
        "--diff-filter=AMR",
        "--pretty=format:COMMIT\t%H\t%cI\t%s",
        "--",
        "*.md",
    )

    # Newest first: keep the first (most recent) event per markdown path.
    latest: dict[str, dict] = {}
    current_date = ""
    current_subject = ""
    current_commit = ""

    for raw in log.splitlines():
        line = raw.strip("\n")
        if not line.strip():
            continue
        if line.startswith("COMMIT\t"):
            _, current_commit, current_date, current_subject = line.split("\t", 3)
            continue
        parts = line.split("\t")
        if len(parts) < 2:
            continue
        status = parts[0]
        if status.startswith("R") and len(parts) >= 3:
            md_path = decode_git_path(parts[2])
            kind = "added"
        elif status.startswith("A"):
            md_path = decode_git_path(parts[1])
            kind = "added"
        elif status.startswith("M"):
            md_path = decode_git_path(parts[1])
            kind = "changed"
        else:
            continue

        md_path = md_path.replace("\\", "/")
        if not md_path.lower().endswith(".md"):
            continue
        if Path(md_path).stem.endswith("@"):
            continue
        if md_path in latest:
            continue

        latest[md_path] = {
            "date": current_date,
            "kind": kind,
            "subject": current_subject,
            "commit": current_commit,
            "md": md_path,
        }

    entries = []
    for md_path, meta in latest.items():
        page = by_md.get(md_path)
        if not page:
            fname = Path(md_path).name
            page = next((p for p in pages if Path(p["md"]).name == fname), None)
        if not page:
            continue
        if str(page.get("section", "")).rstrip().endswith("@"):
            continue
        entries.append(
            {
                "id": page["id"],
                "title": title_from_md(page["md"]),
                "section": page["section"],
                "md": page["md"],
                "date": meta["date"],
                "kind": meta["kind"],
                "note": meta["subject"],
            }
        )

    # Newest first by full commit timestamp (not day-only).
    entries.sort(key=lambda e: (e["date"], e["id"]), reverse=True)

    out = {
        "generated": run_git("log", "-1", "--format=%cI").strip(),
        "days_scanned": DAYS,
        "entries": entries,
    }
    (ROOT / "changes.json").write_text(
        json.dumps(out, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )
    print(f"Wrote changes.json ({len(entries)} pages, last {DAYS} days)")


if __name__ == "__main__":
    main()
