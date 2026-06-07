# ✨ Zerokaze Blog

> 基于 **SvelteKit** 构建的现代化个人博客网站

🌐 **在线地址**: <https://zerokaze420.github.io/zerokaze_blog_sveltekit/>

---

## 📖 简介

这是一个使用 Svelte 5 + SvelteKit 构建的个人技术博客。支持 Markdown 文章编写、Svelte 组件嵌入、标签分类、时间线展示等功能。

## 🚀 快速开始

```bash
# 安装依赖
bun install

# 启动开发服务器
bun run dev

# 构建生产版本
bun run build

# 预览构建结果
bun run preview
```

## ✍️ 新建文章

使用脚手架脚本快速创建新文章：

```bash
bun run new-post "文章标题"
```

或者手动在 `src/lib/posts/` 下创建 `.md` 文件。

## 🛠️ 技术栈

| 技术 | 用途 |
|------|------|
| **Svelte 5** | 前端框架 (Runes 响应式) |
| **SvelteKit** | Web 应用框架 |
| **Tailwind CSS v4** | 原子化 CSS |
| **mdsvex** | Markdown → Svelte 组件 |
| **TypeScript** | 类型安全 |
| **Bun** | 运行时 & 包管理 |
| **Nix** | 开发环境管理 |
| **GitHub Actions** | CI/CD 自动部署 |

## 📁 项目结构

```
src/
├── app.css                # 全局样式（暗色主题）
├── lib/
│   ├── components/        # Svelte 组件
│   │   ├── Sidebar/       # 导航栏
│   │   ├── Timeline/      # 博客时间线
│   │   ├── Footer.svelte  # 页脚
│   │   └── ...            # 其他组件
│   ├── posts/             # 📝 博客文章 (Markdown)
│   └── types.ts           # 类型定义
├── routes/
│   ├── +layout.svelte     # 根布局
│   ├── (app)/
│   │   ├── +page.svelte   # 首页
│   │   ├── blog/          # 博客列表 & 详情
│   │   ├── tags/          # 标签页面
│   │   ├── calendar/      # 时间线页面
│   │   └── about/         # 关于页面
│   └── resume/            # 简历页面
└── app.html               # HTML 模板
```

## 📄 文章 Frontmatter

每篇文章需要 YAML 头部元数据：

```yaml
---
title: "文章标题"
publishDate: "2026-06-07"
author: "Zerokaze"
description: "文章简短描述"
tags: [Svelte, CSS, Linux]
---
```

## 🔧 可用命令

| 命令 | 说明 |
|------|------|
| `bun run dev` | 启动开发服务器 |
| `bun run build` | 构建生产版本 |
| `bun run preview` | 预览构建结果 |
| `bun run check` | TypeScript 类型检查 |
| `bun run lint` | ESLint 代码检查 |
| `bun run new-post` | 新建文章脚手架 |

## 🐳 Docker 部署

```bash
docker build -t zerokaze-blog .
docker run -p 8080:80 zerokaze-blog
```

## 📝 Todo

> 按优先级排序

- [ ] 性能优化，移除静态图片，替换为 SVG 或纯色背景
- [ ] 添加搜索功能
- [ ] 添加 RSS 订阅
- [ ] 文章阅读统计

## 🤝 贡献

欢迎提 Issue 或 PR！如果你有任何建议或发现了 Bug，请在 GitHub 上提出。

## 📄 许可证

本项目基于 MIT 许可证开源。
