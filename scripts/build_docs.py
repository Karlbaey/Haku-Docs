from __future__ import annotations

import argparse
import subprocess
import sys
from pathlib import Path
from urllib.parse import urlsplit, urlunsplit


ROOT = Path(__file__).resolve().parents[1]
PUBLIC_DIR = ROOT / "public"


def run(command: list[str]) -> None:
    subprocess.run(command, cwd=ROOT, check=True)


def ensure_pagefind() -> None:
    try:
        import pagefind  # noqa: F401
    except ImportError as exc:
        raise SystemExit(
            "缺少 pagefind。请先执行: python -m pip install -r requirements.txt"
        ) from exc


def normalize_base_url(base_url: str) -> str:
    parsed = urlsplit(base_url)
    if parsed.scheme not in {"http", "https"} or not parsed.netloc:
        raise SystemExit("--base-url 必须是绝对 URL，例如 https://example.github.io/Haku-Docs/")

    if parsed.query or parsed.fragment:
        raise SystemExit("--base-url 不能包含 query 或 fragment。")

    path = parsed.path or "/"
    if not path.endswith("/"):
        path = f"{path}/"

    return urlunsplit((parsed.scheme, parsed.netloc, path, "", ""))


def build_site(base_url: str | None) -> None:
    command = ["hugo"]
    if base_url:
        command.extend(["--baseURL", normalize_base_url(base_url)])
    run(command)


def build_search_index() -> None:
    ensure_pagefind()

    if not PUBLIC_DIR.exists():
        raise SystemExit("找不到 public/ 目录，无法建立搜索索引。")

    run(
        [
            sys.executable,
            "-m",
            "pagefind",
            "--site",
            str(PUBLIC_DIR),
            "--output-subdir",
            "pagefind",
        ]
    )


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="构建 Hugo 站点并生成 Pagefind 搜索索引。"
    )
    parser.add_argument(
        "--base-url",
        dest="base_url",
        help="可选的生产绝对 URL，例如 https://example.github.io/Haku-Docs/",
    )
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    build_site(args.base_url)
    build_search_index()


if __name__ == "__main__":
    main()
