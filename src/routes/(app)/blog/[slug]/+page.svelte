<script lang="ts">
  import type { PageData } from './$types';
  import { highlight } from '$lib/utils/highlight';

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
  <header class="post-header">
    <div class="post-breadcrumb">
      <a href="/blog" class="breadcrumb-link">← 返回所有文章</a>
    </div>
    <h1 class="post-title">{data.post.title}</h1>
    <div class="post-meta-bar">
      <time class="post-date">
        📅 {new Date(data.post.date).toLocaleDateString('zh-CN', {
          year: 'numeric', month: 'long', day: 'numeric'
        })}
      </time>
      <span class="meta-sep">·</span>
      <span class="post-author">✍️ {data.post.author}</span>
      {#if data.post.tags?.length}
        <span class="meta-sep">·</span>
        <div class="post-tags">
          {#each data.post.tags as tag}
            <a href="/tags/{tag}" class="post-tag">#{tag}</a>
          {/each}
        </div>
      {/if}
    </div>
  </header>

  <div class="post-content prose prose-lg" use:highlight>
    {#key data.post.slug}
      {#await postContentPromise}
        <div class="state-box"><div class="spinner"></div><p>加载中...</p></div>
      {:then module}
        {@const Content = module.default}
        <Content />
      {:catch error}
        <div class="state-box error"><p>⚠️ 加载失败: {error.message}</p></div>
      {/await}
    {/key}
  </div>

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
    color: var(--color-accent);
    text-decoration: none;
    font-size: 0.9rem;
    transition: color 0.2s;
  }

  .breadcrumb-link:hover {
    color: var(--color-accent-light);
  }

  .post-title {
    font-size: 2.2rem;
    font-weight: 800;
    color: var(--color-text-primary);
    line-height: 1.2;
    margin-bottom: 1rem;
  }

  .post-meta-bar {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    flex-wrap: wrap;
    color: var(--color-text-muted);
    font-size: 0.9rem;
  }

  .meta-sep {
    color: var(--color-text-dim);
  }

  .post-tags {
    display: flex;
    gap: 0.4rem;
    flex-wrap: wrap;
  }

  .post-tag {
    color: var(--color-accent-light);
    text-decoration: none;
    font-size: 0.85rem;
    transition: color 0.2s;
  }

  .post-tag:hover {
    color: var(--color-accent);
  }

  .post-content {
    padding: 2rem 1.5rem;
    background: var(--color-bg-card);
    backdrop-filter: blur(12px);
    border: 1px solid var(--color-border);
    border-radius: 16px;
    line-height: 1.8;
  }

  .state-box {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 200px;
    color: var(--color-text-muted);
  }

  .state-box.error p {
    color: #f87171;
  }

  .spinner {
    width: 36px;
    height: 36px;
    border: 3px solid rgba(255, 255, 255, 0.05);
    border-top-color: var(--color-accent);
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
    margin-bottom: 0.75rem;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  .post-footer {
    margin-top: 2rem;
  }

  .footer-divider {
    border: none;
    border-top: 1px solid var(--color-border);
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
    color: var(--color-accent-light);
    text-decoration: none;
    font-size: 0.9rem;
    transition: all 0.2s;
  }

  .footer-back:hover {
    background: rgba(96, 165, 250, 0.2);
  }

  @media (max-width: 640px) {
    .post-title { font-size: 1.6rem; }
  }
</style>
