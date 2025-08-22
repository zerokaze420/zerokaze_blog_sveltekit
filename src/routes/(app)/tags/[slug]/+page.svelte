<script lang="ts">
  import type { PageData } from './$types';

  const { data } = $props<{ data: PageData }>();

  // --- 改動從這裡開始 ---

  // 1. 使用 import.meta.glob 讓 Vite 掃描所有可能的 .md 檔案
  // 這會回傳一個物件，key 是檔案路徑，value 是一個返回 Promise 的 import 函數
  const modules = import.meta.glob('/src/lib/posts/*.md') as Record<string, () => Promise<any>>;

  // 2. 根據 slug 構造出完整的檔案路徑 key
  const path = `/src/lib/posts/${data.metadata.slug}.md`;

  // 3. 從 modules 物件中找到對應的 import 函數並執行它，得到 Promise
  // 如果找不到對應的 post，就返回一個 rejected Promise
  const postContentPromise = modules[path] 
    ? modules[path]() 
    : Promise.reject(new Error(`找不到文章：${path}`));

  // --- 改動在這裡結束 ---
</script>

<article class="min-h-screen">
  <h1 class="text-center">{data.metadata.title}</h1>
  <div class="prose 
              text-shadow: none
              prose-lg 
              prose-slate 
              mx-auto
              prose-h2:text-white
              prose-p:text-white
              prose-ul:text-white
              prose-code:text-white
              prose-code:bg-gray-800
              prose-code:rounded-lg
              prose-code:p-1
              prose-code:font-mono
              prose-code:text-sm
              prose-code:bg-opacity-50
              prose-code:shadow-sm
              prose-code:border-none
              prose-code:overflow-x-auto
              rounded-lg
              p-5
              shadow-lg
              ">
    {#key data.metadata.slug}
      {#await postContentPromise}
        <p>正在加载...</p>
      {:then module}
        {@const Content = module.default}
        <Content />
      {:catch error}
        <p style="color: red;">加载失败: {error.message}</p>
      {/await}
    {/key}
  </div>
</article>