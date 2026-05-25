#!/usr/bin/env python3
"""从 App Store 拉取 512×512 官方应用图标，写入 public/logos/{id}.png"""

from __future__ import annotations

import json
import urllib.parse
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1] / "public" / "logos"

SEARCH: list[tuple[str, str, str | None]] = [
    ("baidu", "百度网盘", None),
    ("aliyun", "阿里云盘", None),
    ("quark", "夸克网盘", "夸克"),
    ("weiyun", "腾讯微云", "微云"),
    ("115", "115", "115"),
    ("123", "123云盘", "123"),
    ("tianyi", "天翼云盘", "天翼"),
    ("xunlei", "迅雷", "迅雷"),
]


def search(term: str, limit: int = 8) -> list[dict]:
    q = urllib.parse.urlencode(
        {"term": term, "country": "cn", "entity": "software", "limit": limit}
    )
    with urllib.request.urlopen(f"https://itunes.apple.com/search?{q}") as resp:
        return json.load(resp).get("results", [])


def pick(results: list[dict], keyword: str | None, fallback_term: str) -> dict | None:
    if keyword:
        for r in results:
            if keyword in r.get("trackName", ""):
                return r
    for r in results:
        if fallback_term in r.get("trackName", ""):
            return r
    return results[0] if results else None


def main() -> None:
    ROOT.mkdir(parents=True, exist_ok=True)
    for drive_id, term, keyword in SEARCH:
        results = search(term)
        app = pick(results, keyword, term)
        if not app:
            print(f"skip {drive_id}: no App Store result")
            continue
        url = app["artworkUrl512"]
        out = ROOT / f"{drive_id}.png"
        urllib.request.urlretrieve(url, out)
        print(f"{drive_id}: {app['trackName']} -> {out.name}")


if __name__ == "__main__":
    main()
