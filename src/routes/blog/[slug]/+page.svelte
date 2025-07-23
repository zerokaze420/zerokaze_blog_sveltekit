<script lang="ts">
  import type { PageData } from './$types';
  const { data } = $props<{ data: PageData }>();
  const postContentPromise = $derived(
    import(`../../../lib/posts/${data.metadata.slug}.md`)
  );
</script>

<article class="min-h-screen">
  <h1 class="text-center">{data.metadata.title}</h1>
  <div class="prose prose-lg prose-slate mx-auto
              bg-black/20                 /* 半透明白色背景 */
              [backdrop-filter:blur(10px)] /* 直接使用任意值 */
              rounded-lg                  /* 圆角 */
              p-5                         /* 内边距 */
              shadow-lg                   /* 可选：阴影 */
              ">
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