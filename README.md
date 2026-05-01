# Haku Docs

Haku Docs 是一个基于 Hugo 的文档站骨架，目标是保持简洁、易读、轻量，同时具备可公开发布和持续协作所需的最小工程约束。

## 特性概览

- Hugo 驱动的中文文档站结构，默认信息架构清晰，适合继续扩展。
- 内置 Pagefind 搜索、文档侧栏、面包屑、页内目录和上一篇/下一篇导航。
- GitHub Pages 部署工作流会注入生产绝对 URL，保证 canonical 和 `og:url` 正确输出。
- Front Matter 规则由仓库脚本和 CI 统一校验，减少合并后才暴露的问题。

## 环境要求

- PowerShell 7
- Hugo Extended 0.161.1 或更高版本
- Python 3.13 或更高版本

先安装搜索依赖：

```powershell
python -m pip install -r requirements.txt
```

## 本地预览

```powershell
hugo server --disableFastRender
```

本地 `hugo.toml` 保持 `baseURL = "/"`，不要在本地把生产域名硬编码进配置。

## 完整构建

先执行 Front Matter 校验：

```powershell
python scripts/check_front_matter.py
```

再执行完整构建：

```powershell
python scripts/build_docs.py
```

如果要模拟 GitHub Pages 的生产绝对链接，可显式传入绝对 URL：

```powershell
python scripts/build_docs.py --base-url https://example.github.io/Haku-Docs/
```

## GitHub Pages 发布

- `main` 分支推送会触发 `.github/workflows/deploy.yml`。
- 工作流先运行 `actions/configure-pages`，再把其 `base_url` 输出传给 `python scripts/build_docs.py --base-url ...`。
- 构建完成后上传 `public/`，随后由 GitHub Pages 部署。

这意味着：

- 本地开发继续使用相对根路径。
- 生产环境会自动生成正确的绝对链接，无需手改 `hugo.toml`。

## Front Matter 约束

仓库当前把页面分成三类，规则同时写入 `scripts/check_front_matter.py` 和 CI：

| 文件范围 | 必填字段 |
| --- | --- |
| `content/_index.md`、`content/docs/_index.md` | `title`、`description` |
| `content/docs/*/_index.md` | `title`、`description`、`weight`、`lastmod` |
| `content/docs/**/*.md` 中的普通页面 | `title`、`description`、`weight`、`date`、`lastmod` |

附加规则：

- `weight` 必须是正整数。
- `date` 和 `lastmod` 必须是可被 ISO 8601 解析的值。
- 空字符串视为缺失。

## 发布前需要替换的占位项

- 把 `hugo.toml` 里的 `https://github.com/<owner>/Haku-Docs/edit/main/content` 替换成真实仓库地址。
- 视项目实际情况调整 `title`、`params.description` 和 `params.footer`。
- 如果后续补分享图，再填写 `params.seo.defaultImage`；当前范围保持留空。
