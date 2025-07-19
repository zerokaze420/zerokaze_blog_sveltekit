<script lang="ts">
  import type { PageData } from './$types';
  const { data } = $props<{ data: PageData }>();
  // 使用 Svelte 的响应式语法 `$: `
  // 这行代码会在 `data` 属性发生变化时自动重新运行
const postContentPromise = $derived(
    import(`../../../lib/posts/${data.metadata.slug}.md`)
  );
  </script>



<article class="min-h-screen">
  <h1 class="text-center">{data.metadata.title}</h1>
    <div class="prose prose-lg prose-slate mx-auto">
  {#key data.metadata.slug}
    {#await postContentPromise}
      <p>正在加载...</p>
    {:then module}
      <svelte:component this={module.default} />
    {:catch error}
      <p style="color: red;">加载失败: {error.message}</p>
    {/await}
  {/key}
  </div>
</article>
