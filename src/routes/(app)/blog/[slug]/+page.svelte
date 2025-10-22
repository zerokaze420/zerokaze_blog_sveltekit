<script lang="ts">
  import type { PageData } from './$types';

  const { data } = $props<{ data: PageData }>();

  // 使用 import.meta.glob 让 Vite 扫描所有可能的 .md 文件
  const modules = import.meta.glob('/src/lib/posts/*.md') as Record<string, () => Promise<any>>;

  // 根据 slug 构造出完整的文件路径 key
  const path = `/src/lib/posts/${data.post.slug}.md`;

  // 从 modules 对象中找到对应的 import 函数并执行它
  const postContentPromise = modules[path] 
    ? modules[path]() 
    : Promise.reject(new Error(`找不到文章：${path}`));
</script>

<svelte:head>
  <title>{data.post.title}</title>
  <meta name="description" content={data.post.description} />
</svelte:head>

<div class="flex flex-col items-center justify-center py-8">
  <h1 class="text-4xl font-bold text-center mb-4">{data.post.title}</h1>
  <div class="flex gap-2 text-gray-500 mb-4">
    <p>{data.post.date}</p>
    <p>•</p>
    <p>By {data.post.author}</p>
  </div>
  <div class="flex gap-2 mb-8">
    {#each data.post.tags as tag (tag)}
      <a href="/blog/tags/{tag}" class="text-blue-500 hover:underline">#{tag}</a>
    {/each}
  </div>
</div>

<div class="flex flex-col lg:flex-row lg:justify-center lg:gap-8 px-4">
  <!-- 主要修改在这里：添加了 flex 居中容器 -->
  <div class="flex justify-center w-full">
    <div class="prose max-w-none lg:max-w-3xl mx-auto text-center">
      {#key data.post.slug}
        {#await postContentPromise}
          <p class="text-center">正在加载...</p>
        {:then module}
          {@const Content = module.default}
          <Content />
        {:catch error}
          <p class="text-center" style="color: red;">加载失败: {error.message}</p>
        {/await}
      {/key}
    </div>
  </div>

  <div class="lg:w-1/4 mt-8 lg:mt-0">
    <div class="mt-8">
    </div>
  </div>
</div>