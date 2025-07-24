---
title: "TanStack Query 学习笔记"
publishDate: "2025-07-24"
author: "CSS"
description: "TanStack Query是一个功能强大的数据获取和状态管理库他支持几乎所有框架包括不限于vue,react"
---


TanStack Query是一个功能强大的数据获取和状态管理库他支持几乎所有框架包括不限于vue,react

## 核心概念

### Queries (查询)

查询用于从服务器获取数据。Svelte Query 会自动管理查询的缓存、后台更新、过期、错误处理和加载状态。

### Mutations (突变)

突变用于向服务器发送数据（例如 POST、PUT、DELETE 请求）。它们可以触发查询的重新验证，并支持乐观更新。


# 安装

```shell
bun add @tanstack/svelte-query
```

Svelte Query 需要一个 `QueryClient` 实例来管理所有的查询和缓存。你通常会在应用的根组件中设置它。

```js
<script lang="ts">
import '../app.css';
import Header from '$lib/components/Sidebar/Header.svelte';
import { QueryClientProvider, QueryClient } from '@tanstack/svelte-query';
const queryClient = new QueryClient();
let { children } = $props();
</script>
<QueryClientProvider client={queryClient}>
<div class=" min-h-screen">
<main class=" w-full p-8 flex-col">
<Header class="w-full h-16 bg-white shadow-md" />

{@render children()}
</main>
</QueryClientProvider>
</div>
```