---
title: "样式与主题定制"
description: "通过 CSS 变量、字体配置和模板局部文件修改这套主题的外观。"
date: 2026-05-01T01:40:00+08:00
lastmod: 2026-05-01T13:40:00+08:00
weight: 50
---

这套主题的视觉层很集中，主要改两处就够了：

- `assets/css/global.css`
- `layouts/partials/head.html`

## 颜色和明暗模式

`assets/css/global.css` 顶部已经定义了亮色和暗色两套变量：

```css
:root {
  --bg: #faf7f1;
  --surface: #fffdf8;
  --text: #111111;
  --accent: #7e5d22;
}

@media (prefers-color-scheme: dark) {
  :root {
    --bg: #141414;
    --surface: #1a1a1a;
    --text: #ffffff;
    --accent: #e4c687;
  }
}
```

要改主题色，优先改变量，不要直接在组件选择器里散落写值。这样首页卡片、侧栏、正文、页脚会一起跟着变化。

如果你要新增颜色层级，也建议继续补变量，例如：

```css
:root {
  --notice-bg: #f4ecde;
  --notice-border: #c09d69;
}
```

这套站点里不要使用 `color-mix()`，直接定义明确的变量值更可控，也更符合当前项目约束。

这次改版里，搜索弹层、焦点态、TOC 和按钮态也都遵循这个规则：先定义变量，再在组件选择器里引用。

## 字体入口

字体通过 `layouts/partials/head.html` 引入，目前默认是：

- 正文使用 `Noto Sans SC`
- 代码使用 `JetBrains Mono`

如果你要换字体，通常要同时改两处：

1. `head.html` 中的字体加载链接。
2. `global.css` 中 `body` 与 `code, pre, kbd, samp` 的 `font-family`。

## 代码块样式

代码块不是浏览器默认样式，而是主题自己包了一层外框。入口在 `layouts/_default/_markup/render-codeblock.html`：

```go-html-template
{{ $result := transform.HighlightCodeBlock . }}
<div class="code-frame">
  {{ with .Type }}
    <div class="code-frame__lang">{{ . }}</div>
  {{ end }}
  {{ $result.Wrapped }}
</div>
```

这带来两个结果：

- 代码语言标签会显示在代码块顶部。
- 代码块外观由 `.code-frame` 和 `.chroma` 相关样式统一控制。

如果你只是想改圆角、边框、内边距，改 CSS 就够了；如果你想改代码块结构，再去动这个模板。

## 哪些位置最常改

| 目标 | 入口 |
| --- | --- |
| 页头、页脚文案 | `hugo.toml` 里的 `title`、`params.description`、`params.footer` |
| 顶部导航结构 | `layouts/_default/baseof.html` |
| 首页 Hero 区 | `layouts/_default/list.html` 和 `content/_index.md` |
| 文档侧栏标题与列表 | `layouts/partials/docs-nav.html` |
| 搜索弹层与结果列表 | `assets/js/search.js`、`assets/css/global.css` |
| 全站色彩、间距、卡片、表格、代码块 | `assets/css/global.css` |

先从变量层改，再动模板，通常是这套主题最省事的定制路径。
