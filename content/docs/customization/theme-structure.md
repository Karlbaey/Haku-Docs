---
title: "主题结构总览"
description: "先理解目录结构、模板入口和页面路由，再动手扩展这个 Hugo 文档站。"
date: 2026-05-01T01:25:00+08:00
lastmod: 2026-05-01T15:10:00+08:00
weight: 20
---

这套主题不是单独发布的 Hugo theme 包，而是直接放在站点仓库里维护。你可以把它理解为一套已经接好模板、样式和脚本的文档站骨架。

## 关键目录

| 路径 | 作用 |
| --- | --- |
| `content/_index.md` | 首页内容。 |
| `content/docs/_index.md` | 文档分区首页。 |
| `content/docs/<section>/_index.md` | 章节落地页，会出现在首页、文档首页和侧栏。 |
| `content/docs/<section>/*.md` | 具体文档页面，会进入章节导航、面包屑、TOC 和搜索。 |
| `layouts/_default/baseof.html` | 全站基础骨架，定义头部、页脚和主内容区域。 |
| `layouts/docs/list.html` | 文档列表页布局。 |
| `layouts/docs/single.html` | 文档详情页布局。 |
| `layouts/partials/docs-nav.html` | 文档侧栏导航。 |
| `assets/js/search.js` | 搜索弹层和键盘快捷键。 |
| `assets/css/global.css` | 全站样式和明暗主题变量。 |
| `assets/js/docs-nav.js` | 侧栏展开、收起和滚动位置记忆。 |

## 页面路由怎么来的

这个站点主要依赖 Hugo 的内容目录约定：

- `content/_index.md` 对应站点首页 `/`。
- `content/docs/_index.md` 对应文档首页 `/docs/`。
- `content/docs/getting-started/_index.md` 这类章节入口会生成 `/docs/getting-started/`。
- `content/docs/getting-started/local-development.md` 这类普通 Markdown 页面会生成 `/docs/getting-started/local-development/`。

只要页面放在 `content/docs/` 下，它就会自动进入当前主题的文档体系，包括：

- 首页和 `/docs/` 的章节卡片目录。
- 文档页左侧的分层导航列表。
- 文档详情页的面包屑和页内目录。
- 文档详情页底部的上一篇、下一篇。
- 完整构建后的搜索索引。

## 模板分工

这套主题把“普通页面”和“文档页面”分开处理：

- `layouts/_default/*.html` 负责首页和通用页面。
- `layouts/docs/*.html` 负责 `docs` 分区，带文档侧栏和翻页导航。

这意味着你如果想新增一个普通介绍页，可以放到 `content/` 下；如果想让它出现在文档目录里，就放到 `content/docs/` 下。

## 配置入口

全站基础设置集中在 `hugo.toml`：

```toml
baseURL = "/"
locale = "zh-CN"
title = "Haku Docs"
defaultContentLanguage = "zh-cn"
enableRobotsTXT = true
disableKinds = ["taxonomy", "term", "RSS"]
hasCJKLanguage = true
```

这里控制的是站点标题、语言、是否生成 robots.txt，以及是否禁用 taxonomy、RSS 等当前主题没用到的页面类型。

当前有两个和发布直接相关的约定：

- 本地 `baseURL` 固定保持为 `/`，不要把生产域名直接写进 `hugo.toml`。
- GitHub Pages 部署时由 `python scripts/build_docs.py --base-url <absolute-url>` 注入生产绝对 URL，这样 canonical 和 `og:url` 会在生产构建中自动变成正确地址。

同一个配置文件里还保留了 `params.docs.editContentBaseURL`，默认使用 `https://github.com/<owner>/Haku-Docs/edit/main/content` 占位。公开发布前记得替换 `<owner>`。

## 推荐工作方式

如果你准备继续扩展这个主题，建议按下面的顺序动手：

1. 先在 `content/docs/` 的某个章节目录里新增页面，确认内容流转没问题。
2. 再调整 `weight`、`description` 和 `lastmod`，把目录顺序和摘要补齐。
3. 最后才去改 `layouts/` 或 `assets/css/global.css`，避免一开始就同时动内容和模板。

这样排查会简单很多。
