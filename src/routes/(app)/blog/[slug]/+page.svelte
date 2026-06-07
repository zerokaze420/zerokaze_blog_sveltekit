<script lang="ts">
  import type { PageData } from './$types';

  let { data } = $props<{ data: PageData }>();

  const modules = import.meta.glob('/src/lib/posts/*.md') as Record<string, () => Promise<any>>;
  const path = `/src/lib/posts/${data.post.slug}.md`;
  const postContentPromise = modules[path]
    ? modules[path]()
    : Promise.reject(new Error(`找不到文章：${path}`));
</script>

<svelte:head>
  <title>{data.post.title} - Zerokaze Blog</title>
  <meta name="description" content={data.post.description} />
</svelte:head>

<article class="post-article">
  <!-- 文章头部 -->
  <header class="post-header">
    <div class="post-breadcrumb">
      <a href="/blog" class="breadcrumb-link">← 返回所有文章</a>
    </div>
    <h1 class="post-title">{data.post.title}</h1>
    <div class="post-meta-bar">
      <time class="post-date">
        📅 {new Date(data.post.date).toLocaleDateString('zh-CN', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })}
      </time>
      <span class="meta-separator">·</span>
      <span class="post-author">✍️ {data.post.author}</span>
      {#if data.post.tags?.length}
        <span class="meta-separator">·</span>
        <div class="post-tags">
          {#each data.post.tags as tag}
            <a href="/tags/{tag}" class="post-tag">#{tag}</a>
          {/each}
        </div>
      {/if}
    </div>
  </header>

  <!-- 文章内容 -->
  <div class="post-content prose
    prose-lg
    prose-slate
    mx-auto
    prose-headings:text-white
    prose-h1:text-3xl
    prose-h2:text-2xl
    prose-h2:mt-10
    prose-h2:mb-4
    prose-h2:border-b
    prose-h2:border-white/10
    prose-h2:pb-2
    prose-h3:text-xl
    prose-p:text-gray-300
    prose-p:leading-relaxed
    prose-a:text-blue-400
    prose-a:no-underline
    prose-a:hover:underline
    prose-strong:text-white
    prose-strong:font-semibold
    prose-code:text-blue-300
    prose-code:bg-white/5
    prose-code:rounded-lg
    prose-code:px-1.5
    prose-code:py-0.5
    prose-code:font-mono
    prose-code:text-sm
    prose-code:before:content-none
    prose-code:after:content-none
    prose-pre:bg-gray-900
    prose-pre:border
    prose-pre:border-white/10
    prose-pre:rounded-xl
    prose-pre:shadow-lg
    prose-blockquote:border-l-blue-500
    prose-blockquote:text-gray-400
    prose-blockquote:bg-white/5
    prose-blockquote:rounded-r-lg
    prose-blockquote:py-1
    prose-blockquote:px-4
    prose-ul:text-gray-300
    prose-ol:text-gray-300
    prose-li:marker:text-blue-400
    prose-img:rounded-xl
    prose-img:shadow-lg
    prose-hr:border-white/10
    ">
    {#key data.post.slug}
      {#await postContentPromise}
        <div class="loading-state">
          <div class="spinner"></div>
          <p>加载中...</p>
        </div>
      {:then module}
        {@const Content = module.default}
        <Content />
      {:catch error}
        <div class="error-state">
          <p>⚠️ 加载失败: {error.message}</p>
        </div>
      {/await}
    {/key}
  </div>

  <!-- 文章底部 -->
  <footer class="post-footer">
    <hr class="footer-divider" />
    <div class="footer-nav">
      <a href="/blog" class="footer-back">← 返回所有文章</a>
    </div>
  </footer>
</article>

<style>
  .post-article {
    max-width: 800px;
    margin: 0 auto;
    padding: 1rem 0 3rem;
  }

  .post-header {
    margin-bottom: 2.5rem;
    text-align: center;
  }

  .post-breadcrumb {
    text-align: left;
    margin-bottom: 1rem;
  }

  .breadcrumb-link {
    color: #60a5fa;
    text-decoration: none;
    font-size: 0.9rem;
    transition: color 0.2s;
  }

  .breadcrumb-link:hover {
    color: #93c5fd;
  }

  .post-title {
    font-size: 2.2rem;
    font-weight: 800;
    color: #f1f5f9;
    line-height: 1.2;
    margin-bottom: 1rem;
  }

  .post-meta-bar {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    flex-wrap: wrap;
    color: #94a3b8;
    font-size: 0.9rem;
  }

  .meta-separator {
    color: #475569;
  }

  .post-tags {
    display: flex;
    gap: 0.4rem;
    flex-wrap: wrap;
  }

  .post-tag {
    color: #93c5fd;
    text-decoration: none;
    font-size: 0.85rem;
    transition: color 0.2s;
  }

  .post-tag:hover {
    color: #60a5fa;
  }

  .post-content {
    padding: 1rem;
    background: rgba(30, 41, 59, 0.4);
    backdrop-filter: blur(12px);
    border: 1px solid rgba(255, 255, 255, 0.06);
    border-radius: 16px;
  }

  .loading-state,
  .error-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 200px;
    color: #94a3b8;
  }

  .spinner {
    width: 36px;
    height: 36px;
    border: 3px solid rgba(255, 255, 255, 0.05);
    border-top-color: #60a5fa;
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
    margin-bottom: 0.75rem;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  .error-state p {
    color: #f87171;
  }

  .post-footer {
    margin-top: 2rem;
  }

  .footer-divider {
    border: none;
    border-top: 1px solid rgba(255, 255, 255, 0.06);
    margin-bottom: 1.5rem;
  }

  .footer-nav {
    text-align: center;
  }

  .footer-back {
    display: inline-block;
    padding: 0.6rem 1.5rem;
    background: rgba(96, 165, 250, 0.1);
    border: 1px solid rgba(96, 165, 250, 0.2);
    border-radius: 10px;
    color: #93c5fd;
    text-decoration: none;
    font-size: 0.9rem;
    transition: all 0.2s;
  }

  .footer-back:hover {
    background: rgba(96, 165, 250, 0.2);
  }

  @media (max-width: 640px) {
    .post-title {
      font-size: 1.6rem;
    }
  }
</style>
