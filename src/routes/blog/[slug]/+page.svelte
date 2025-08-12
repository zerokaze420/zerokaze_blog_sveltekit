<script lang="ts">
  import type { PageData } from './$types';
  import hljs from 'highlight.js/lib/core';
  import javascript from 'highlight.js/lib/languages/javascript';
  // ...确保你导入了所有需要的语言
  import typescript from 'highlight.js/lib/languages/typescript';
  import 'highlight.js/styles/github-dark.css'; // 确保样式文件被正确导入
  
  // 关键：检查这里是否注册了你需要的语言
  // 比如，如果你的代码块是 `lang="typescript"`，你必须注册 `typescript`
  hljs.registerLanguage('javascript', javascript);
  hljs.registerLanguage('typescript', typescript);
  
  const { data } = $props<{ data: PageData }>();
  const postContentPromise = $derived(
    import(`../../../lib/posts/${data.metadata.slug}.md`)
  );

  let articleElement: HTMLElement;

  // 关键：检查这个 effect 是否在运行
  $effect(() => {
    console.log("Effect is running. articleElement:", articleElement); // 添加日志
    if (articleElement) {
      const codeBlocks = articleElement.querySelectorAll('pre code');
      console.log("Found code blocks:", codeBlocks); // 检查是否找到了代码块
      codeBlocks.forEach((block) => {
        hljs.highlightElement(block as HTMLElement);
      });
    }
  });
</script>

<article class="min-h-screen" bind:this={articleElement}>
  <h1 class="text-center">{data.metadata.title}</h1>
  <div class="prose prose-lg prose-slate mx-auto
              bg-white
              rounded-lg
              p-5">
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