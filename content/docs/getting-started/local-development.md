---
title: "本地开发与构建"
description: "用 Hugo 和 Pagefind 构建站点，并验证搜索、导航和明暗模式是否正常。"
date: 2026-05-01T01:45:00+08:00
lastmod: 2026-05-01T15:10:00+08:00
weight: 60
---

写这套主题时，最常用的是一个预览命令和一个完整构建命令。两者的区别在于：`hugo server` 适合改版式和内容，完整构建才会生成搜索索引。

## 本地预览

```powershell
hugo server --disableFastRender
```

这条命令适合日常改内容、改样式、改模板时使用。访问本地开发地址后，建议至少检查这几项：

- 首页是否列出了最新文档。
- `/docs/` 页面是否按章节显示入口卡片。
- 文档详情页侧栏是否展开当前章节并高亮当前页面。
- 缩窄浏览器宽度后，目录按钮是否还能正常展开和收起。
- `Ctrl+K` 或 `Cmd+K` 是否能打开搜索弹层。
- 系统切到深色模式后，页面是否自动切换颜色。

## 完整构建

先安装搜索索引工具：

```powershell
python -m pip install -r requirements.txt
```

建议先做 Front Matter 校验：

```powershell
python scripts/check_front_matter.py
```

然后执行完整构建：

```powershell
python scripts/build_docs.py
```

这个脚本会先执行 `hugo`，再调用 Pagefind 为 `public/` 生成搜索索引。构建完成后，建议确认：

- `public/pagefind/` 已生成。
- `public/sitemap.xml` 已生成。
- 搜索结果可以命中标题、正文和代码片段。

如果你要预演 GitHub Pages 生产环境里的绝对链接，可以额外执行：

```powershell
python scripts/build_docs.py --base-url https://example.github.io/Haku-Docs/
```

这一步主要用于确认 canonical 和 `og:url` 已经切到生产绝对地址，而不需要改本地 `hugo.toml`。

## CI 现在会检查什么

当前 CI 会在 `pull_request`、推送到 `dev` / `main`，以及手动触发时运行两步：

1. `python scripts/check_front_matter.py`
2. `python scripts/build_docs.py`

因此最稳妥的本地习惯就是按同样顺序先校验，再完整构建。

## 写内容时的检查顺序

如果你改完后感觉页面“不对”，可以按这个顺序排查：

1. 先看 Markdown 文件 front matter 是否完整，尤其是 `title`、`description`、`weight`。
2. 再确认普通文档页是否补齐了 `date` 和 `lastmod`，章节 `_index.md` 是否补齐了 `lastmod`。
3. 再看页面是不是放在 `content/docs/` 下的正确章节目录里。
4. 然后看模板是否真的读取了对应字段。
5. 如果是搜索问题，再确认是否重新执行过完整构建。
6. 最后再查 CSS 或脚本问题。

大多数“页面没进目录”“顺序不对”“搜索不到”“顶部信息没显示”的问题，实际上都出在前两到三步。

## 一个简单的发布前检查清单

- 文档标题是否清楚。
- 卡片摘要是否够短、够准。
- `lastmod` 是否反映了最近一次实质更新。
- 代码块语言标记是否写了，例如 `powershell`、`go`、`bash`。
- 完整构建后搜索是否还能命中新加内容。
- 手机宽度下是否还能顺畅阅读。

如果这些都没问题，这套主题通常就已经可以稳定交付了。
