---
title: "快速开始"
description: "先确认站点能正常构建和阅读，再进入后续定制与写作。"
date: 2026-05-01T01:00:00+08:00
lastmod: 2026-05-01T13:40:00+08:00
weight: 10
---

这一章的目标不是解释全部实现细节，而是先确认这套站点已经具备可用的阅读和构建体验。

## 特性概览

- 页面会自动跟随系统深浅色模式切换。
- 文档支持键盘快捷搜索。
- 侧栏、面包屑和页内目录会自动根据内容结构生成。
- 正文字体固定为 `Noto Sans SC`。
- 所有代码相关元素使用 `JetBrains Mono`。
- 代码块背景统一为纯黑色。

## 推荐阅读顺序

1. 先看本章后面的“本地开发与构建”。
2. 再进入“站点定制”理解模板和样式入口。
3. 最后看“内容编写”，继续扩展自己的文档页面。

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
