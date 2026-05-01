使用 PowerShell 7.0 指令。**在删除任何文件前必须征询我的意见。**

这是一个 Hugo 驱动的文档站，主推简洁，易读，轻量。

**环境**: Windows + UTF-8 编码 + PowerShell 7
**语言**: 默认中文（代码/命令/日志保持原语言）

## 开发命令

```powershell
# 首次安装搜索依赖
python -m pip install -r requirements.txt

# 本地预览（--disableFastRender 避免新旧内容交错）
hugo server --disableFastRender

# 完整构建（Hugo + Pagefind 搜索索引，顺序在 build_docs.py 内保证）
python scripts/build_docs.py

# 生产构建（带绝对 URL，用于模拟 GitHub Pages）
python scripts/build_docs.py --base-url https://example.github.io/Haku-Docs/
```

## 架构要点

- `baseURL` 始终为 `/`，生产绝对 URL 由 `build_docs.py --base-url` 注入，严禁在 `hugo.toml` 中硬编码域名。
- `public/` 是构建输出，已 gitignore，不要直接修改其中的文件。
- `scripts/check_front_matter.py` 在 README 和文档中多处引用但**尚未实现**，勿尝试运行。
- `.codex/` 已 gitignore，存放本地 ui-ux-pro-max skill 数据，不影响构建。
- 无测试套件，无 lint/typecheck 命令，无 PR 门禁。

## CSS 规则

- 严禁使用 `color-mix()`，应在 `assets/css/global.css` 中定义 CSS 变量后直接取用。
- 所有样式集中在一个文件，通过 `prefers-color-scheme` 切换明暗主题。
- 代码块由 `render-codeblock.html` 包装，始终黑底 + `github-dark` 高亮风格。

## Content Front Matter 约束

| 文件范围 | 必填字段 |
| --- | --- |
| `content/_index.md`、`content/docs/_index.md` | `title`、`description` |
| `content/docs/*/_index.md`（section 索引） | `title`、`description`、`weight`、`lastmod` |
| `content/docs/**/*.md`（普通页面） | `title`、`description`、`weight`、`date`、`lastmod` |

- `weight` 必须为正整数，`date` / `lastmod` 必须为 ISO 8601 格式。空字符串视为缺失。
- `hugo.toml` 中 `editContentBaseURL` 的 `<owner>` 占位项发布前需替换为真实仓库地址。

## 发布

- 推送到 `main` 分支触发 `.github/workflows/deploy.yml`，部署到 GitHub Pages。
- CI 通过 `actions/configure-pages` 获取 `base_url` 后传给 `build_docs.py --base-url` 构建。
