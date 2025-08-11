<script lang="ts">
  import type { PageData } from './$types';
  
  const { data } = $props<{ data: PageData }>();
  
  // $derived 确保当 data.metadata.slug 变化时，会自动重新导入新的 markdown 文件
  const postContentPromise = $derived(
    import(`../../../lib/posts/${data.metadata.slug}.md`)
  );
</script>

<article class="min-h-screen">
  <h1 class="text-center">{data.metadata.title}</h1>
  <div class="prose prose-lg prose-slate mx-auto
              bg-white
              rounded-lg                  /* 圆角 */
              p-5                         /* 内边距 */
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

<style>
  .prose {
    color: var(--text) !important;
  }
</style>