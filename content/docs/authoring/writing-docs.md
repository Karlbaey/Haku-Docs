---
title: "新增文档页面"
description: "用 front matter、weight 和 description 把新文档接入首页、侧栏和翻页。"
date: 2026-05-01T01:30:00+08:00
lastmod: 2026-05-01T15:10:00+08:00
weight: 30
---

这套主题最常见的使用方式，就是继续往 `content/docs/` 下的某个章节目录里加 Markdown 文件。

## 最小可用示例

假设你要往“内容编写”这一章里新增页面，可以新建 `content/docs/authoring/your-page.md`：

```md
---
title: "你的页面标题"
description: "这段文字会出现在首页卡片和文档目录摘要里。"
date: 2026-05-01T09:00:00+08:00
lastmod: 2026-05-01T09:00:00+08:00
weight: 70
---

这里开始写正文。
```

保存后重新加载页面，Hugo 会自动生成：

- `/docs/authoring/your-page/` 页面地址。
- 章节页里的页面卡片。
- 文档侧栏中的导航项。
- 搜索索引中的结果项。

## 这几个 front matter 字段最重要

| 字段 | 用途 |
| --- | --- |
| `title` | 页面标题，同时也会用于导航名称。 |
| `description` | 首页卡片和列表页摘要优先读取这里。 |
| `date` | 文档页顶部会显示“发布于”。 |
| `lastmod` | 文档页顶部会显示“更新于”。 |
| `weight` | 控制排序，数值越小越靠前。 |

当前仓库已经把 Front Matter 规则写入 `scripts/check_front_matter.py` 和 CI。对普通文档页来说，这五个字段都属于必填项，不能依赖模板回退逻辑。

## 当前仓库的 Front Matter 规则

仓库把页面分成三类：

| 文件范围 | 必填字段 |
| --- | --- |
| `content/_index.md`、`content/docs/_index.md` | `title`、`description` |
| `content/docs/*/_index.md` | `title`、`description`、`weight`、`lastmod` |
| `content/docs/**/*.md` 中的普通页面 | `title`、`description`、`weight`、`date`、`lastmod` |

另外还有三条固定规则：

- `weight` 必须是正整数。
- `date` 和 `lastmod` 必须是 ISO 8601 格式。
- 空字符串会被当成缺失。

提交前可以直接本地执行：

```powershell
python scripts/check_front_matter.py
```

## 顺序是怎么控制的

当前主题的几个入口都依赖 Hugo 的排序结果：

- 章节入口按 `.Sections.ByWeight` 输出。
- 章节内页面按 `.RegularPages.ByWeight` 输出。
- 页底“上一篇 / 下一篇”使用当前章节内页面顺序。

因此最简单的规则就是：给每个章节和每篇文档都写明确的 `weight`，不要依赖默认顺序。

一个常见分配方式是：

- `10` 到 `30` 放入门页。
- `40` 到 `70` 放日常使用说明。
- `80` 以后放定制、部署或补充材料。

## 页面内容能用哪些 Markdown 能力

当前主题已经对下面这些元素做了样式处理：

- 二级到四级标题。
- 无序列表和有序列表。
- 表格。
- 引用块。
- 行内代码和代码块。
- 分隔线。

例如：

> 当你只是想补内容时，优先改 `content/docs/`。只有在布局和视觉不满足需求时，再去改模板和样式文件。

## 添加文档时的实践建议

- 文件名保持英文或短横线风格，URL 更稳定。
- 标题写给读者看，文件名写给路径和维护者看。
- `lastmod` 在每次实质修改后更新，读者能更快判断内容是否新鲜。
- 如果一篇内容会长期维护，先把 `description` 写清楚，首页目录会更好扫读。
- 如果你改了内容并且依赖站内搜索，请重新执行完整构建，让 Pagefind 更新索引。
