---
title: "首页、侧栏与翻页"
description: "理解首页目录、文档侧栏、移动端折叠和上一篇下一篇是怎么生成的。"
date: 2026-05-01T01:35:00+08:00
lastmod: 2026-05-01T01:35:00+08:00
weight: 40
---

这套主题的导航逻辑比较直接，内容是否出现、出现在哪、顺序如何，基本都由 `content/docs/` 和 `weight` 决定。

## 首页文档目录

首页模板在 `layouts/_default/list.html`。当前实现会读取 `docs` 分区，并把其中所有文档递归列出来：

```go-html-template
{{ with site.GetPage "section" "docs" }}
  {{ range .RegularPagesRecursive.ByWeight }}
    ...
  {{ end }}
{{ end }}
```

这意味着：

- 只要页面属于 `docs` 分区，就能出现在首页目录。
- 不需要手动维护首页卡片列表。
- 调整 `weight` 后，首页顺序会一起更新。

## 文档侧栏

侧栏模板在 `layouts/partials/docs-nav.html`，逻辑和首页很接近，同样会递归读取 `docs` 下的全部文档。

当前侧栏有三个实际特性：

- 会高亮当前页面。
- 大屏默认展开，小屏默认收起。
- 展开状态保存在 `localStorage`，滚动位置保存在 `sessionStorage`。

对应脚本在 `assets/js/docs-nav.js`，默认断点是 `1180px`。如果你觉得侧栏太激进或太保守，可以直接改这里。

## 文档页布局

文档详情页模板在 `layouts/docs/single.html`，默认会展示：

- 固定在左上的目录按钮。
- 页面标题。
- `date` 和 `lastmod` 对应的发布时间、更新时间。
- 正文内容。
- 页底上一篇、下一篇。

如果某篇文档不想显示日期，可以不写 `date` 或 `lastmod`，模板会自动跳过空值。

## 文档分区首页

`/docs/` 本身也是一页，来自 `content/docs/_index.md` 和 `layouts/docs/list.html`。它除了显示正文，还会列出当前分区下的子页面卡片。

因此这个页面适合放：

- 文档总览说明。
- 阅读建议。
- 面向新用户的入口分类。

## 翻页导航的使用建议

页底翻页来自 `.PrevInSection` 和 `.NextInSection`。如果你希望阅读顺序稳定，最好让文档权重连续，例如：

- `10` 快速开始
- `20` 主题结构总览
- `30` 新增文档页面
- `40` 首页、侧栏与翻页

这样读者从上往下读时，目录顺序、首页顺序和翻页顺序会更接近。
