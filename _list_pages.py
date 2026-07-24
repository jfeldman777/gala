import json
from pathlib import Path

pages = json.loads(Path("pages.json").read_text(encoding="utf-8"))["pages"]
for p in pages:
    print(f"{p['id']}\t{p['section']}\t{p['md']}")
print("TOTAL", len(pages))
