---
title: "快速开始"
description: "查看站点当前的版式、字体和代码高亮表现。"
date: 2026-05-01T01:00:00+08:00
lastmod: 2026-05-01T01:00:00+08:00
weight: 10
---

这一页用于确认文档站的基础表现是否正确，包括版心宽度、标题层级、列表样式，以及 Hugo 代码高亮输出。

## 特性概览

- 页面会自动跟随系统深浅色模式切换。
- 正文字体固定为 `Noto Sans SC`。
- 所有代码相关元素使用 `JetBrains Mono`。
- 代码块背景统一为纯黑色。

## Hugo 运行示例

```powershell
hugo server --disableFastRender
```

## Markdown 代码高亮示例

```go
package main

import "fmt"

func main() {
    message := "Hello, Hugo Docs"
    fmt.Println(message)
}
```

## 行内代码示例

你也可以在段落里使用行内代码，例如 `hugo.toml`、`assets/css/global.css` 和 `layouts/_default/_markup/render-codeblock.html`。
