---
title: "Zerokaze Blog 使用教程"
publishDate: "2026-06-07"
author: "Zerokaze"
description: "详细介绍如何使用本博客系统，包括新建文章、本地开发、部署等操作指南"
tags: [教程, Svelte, SvelteKit, Blog]
---

# Zerokaze Blog 使用教程

欢迎使用 Zerokaze Blog！本文档将帮助你快速上手，包括如何创建新文章、本地开发和部署。

## 📋 目录

1. [技术栈简介](#技术栈简介)
2. [新建文章](#新建文章)
3. [文章编写指南](#文章编写指南)
4. [本地开发](#本地开发)
5. [构建与部署](#构建与部署)
6. [项目结构](#项目结构)

## 技术栈简介

本博客基于以下技术构建：

| 技术 | 用途 |
|------|------|
| **Svelte 5** | 前端框架（使用 runes 响应式语法） |
| **SvelteKit** | 全栈 Web 应用框架 |
| **Tailwind CSS v4** | 原子化 CSS 框架 |
| **mdsvex** | Markdown 转 Svelte 组件 |
| **Bun** | JavaScript 运行时与包管理器 |
| **Nix** | 开发环境管理 |

## 新建文章

### 方法一：使用脚手架脚本（推荐）

项目提供了一个便捷的脚手架脚本，可以快速生成文章模板：

```bash
# 使用 npm 脚本
npm run new-post "你的文章标题"

# 或者直接运行脚本
bash scripts/new-post.sh "你的文章标题"
```

运行后会提示你输入：
- **文章标题**（必填）
- **描述**（文章的简短摘要，会显示在卡片上）
- **标签**（逗号分隔，如 `Svelte, CSS, Linux`）
- **作者**（默认为 `Zerokaze`）

脚本会自动生成 slug 和 frontmatter，并保存在 `src/lib/posts/` 目录下。

### 方法二：手动创建

在 `src/lib/posts/` 目录下手动创建 `.md` 文件，并编写 frontmatter：

```yaml
---
title: "文章标题"
publishDate: "2026-06-07"
author: "Zerokaze"
description: "文章的简短描述，会显示在卡片和时间线上"
tags: [Svelte, CSS, 教程]
---
```

> **注意**：`publishDate` 字段是排序依据，格式请使用 `YYYY-MM-DD`。

## 文章编写指南

### 基础 Markdown

本博客支持所有标准 Markdown 语法：

```markdown
# 一级标题
## 二级标题
### 三级标题

**粗体文本** 和 *斜体文本*

- 无序列表项 1
- 无序列表项 2

1. 有序列表项 1
2. 有序列表项 2

[链接文本](https://example.com)
![图片描述](图片URL)
```

### 代码块

支持使用三个反引号加语言标识来实现语法高亮：

````markdown
```typescript
function greet(name: string): string {
  return `Hello, ${name}!`;
}
```

```python
def hello():
    print("Hello, World!")
```

```bash
echo "Hello from shell"
```
````

> 本博客使用 highlight.js 实现代码语法高亮。

### 嵌入 Svelte 组件

这是本博客最强大的功能之一！你可以在 Markdown 文章中直接嵌入 Svelte 组件。

在你的 `.md` 文件中添加 `<script>` 标签来引入组件：

```markdown
## 互动演示

<script lang="ts">
  import Counter from '$lib/components/Counter.svelte';
  import ProgressBar from '$lib/components/ProgressBar.svelte';
</script>

<Counter />

<ProgressBar progress={75} />
```

可用的内置组件：
- `<Counter />` — 带动画的计数器
- `<ProgressBar progress={50} />` — 进度条
- `<RandomImage />` — 随机图片展示
- `<Wakatime />` — WakaTime 学习统计

### 文章 Frontmatter 字段

| 字段 | 必填 | 说明 |
|------|------|------|
| `title` | ✅ | 文章标题 |
| `publishDate` | ✅ | 发布日期（`YYYY-MM-DD`） |
| `author` | ✅ | 作者名 |
| `description` | ✅ | 文章摘要，会显示在卡片上 |
| `tags` | ❌ | 标签数组，用于分类 |

## 本地开发

### 环境准备

本博客使用 **Nix** 管理开发环境：

```bash
# 进入开发环境
nix develop

# 或者使用 direnv（如果配置了 .envrc）
direnv allow
```

### 启动开发服务器

```bash
# 安装依赖
bun install

# 启动开发服务器（默认 http://localhost:5173）
bun run dev

# 或者以局域网模式启动
bun run dev -- --host
```

### 开发命令

| 命令 | 说明 |
|------|------|
| `bun run dev` | 启动开发服务器 |
| `bun run build` | 构建生产版本 |
| `bun run preview` | 预览构建结果 |
| `bun run check` | TypeScript 类型检查 |
| `bun run lint` | ESLint 代码检查 |
| `bun run new-post` | 新建文章脚手架 |

## 构建与部署

### 构建

```bash
bun run build
```

构建产物会输出到 `build/` 目录。

### 部署

本博客使用 **GitHub Actions** 自动部署到 **GitHub Pages**：

1. 将代码推送到 GitHub 的 `main` 分支
2. GitHub Actions 会自动执行构建和部署流程
3. 部署配置在 `.github/workflows/deploy.yml`

如果你需要修改部署目标，可以编辑 `svelte.config.js` 中的 `paths.base` 配置：

```js
paths: {
  base: process.env.NODE_ENV === 'production' ? '/你的仓库名' : ''
}
```

### Docker 部署

项目也提供了 Docker 支持：

```bash
docker build -t zerokaze-blog .
docker run -p 8080:80 zerokaze-blog
```

## 项目结构

```
src/
├── app.css              # 全局样式（暗色主题、滚动条）
├── app.html             # HTML 模板
├── lib/
│   ├── components/      # Svelte 组件
│   │   ├── Sidebar/     # 导航栏组件
│   │   ├── Calendar/    # 日历组件（旧）
│   │   ├── Timeline/    # 时间线组件 ✨ 新增
│   │   ├── Footer.svelte
│   │   ├── Counter.svelte
│   │   ├── Wakatime.svelte
│   │   └── ...
│   ├── posts/           # 📝 博客文章（Markdown）
│   └── types.ts         # 类型定义
├── routes/
│   ├── +layout.svelte   # 根布局（含 Footer）
│   ├── (app)/
│   │   ├── +layout.svelte     # 应用布局（Header + QueryClient）
│   │   ├── +page.svelte       # 首页
│   │   ├── blog/              # 博客相关页面
│   │   ├── tags/              # 标签页面
│   │   ├── calendar/          # 时间线页面
│   │   └── about/             # 关于页面
│   └── resume/                # 简历页面
└── app.d.ts            # 类型声明
```

---

**Happy Blogging! 🚀** 如果你有任何问题，欢迎在 GitHub 上提 Issue 或贡献代码。
