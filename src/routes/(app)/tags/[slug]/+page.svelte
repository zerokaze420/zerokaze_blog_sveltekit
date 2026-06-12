<script lang="ts">
  import type { PageData } from './$types';
  import { base } from '$app/paths';
  import { highlight } from '$lib/utils/highlight';

  let { data } = $props<{ data: PageData }>();

  const modules = import.meta.glob('/src/lib/posts/*.md') as Record<string, () => Promise<any>>;

  let postContentPromise = $derived(
    data.mode === 'post'
      ? (modules[`/src/lib/posts/${data.metadata.slug}.md`]?.() ?? Promise.reject(new Error('找不到文章')))
      : undefined
  );
</script>

<svelte:head>
  <title>{data.mode === 'tag' ? '标签: ' + data.tag : data.metadata.title} - Zerokaze Blog</title>
  <meta name="description" content={data.mode === 'tag' ? '浏览标签 ' + data.tag + ' 下的所有文章' : data.metadata.description} />
</svelte:head>

{#if data.mode === 'tag'}
  <!-- 标签过滤模式 -->
  <div class="tag-page">
    <header class="tag-header">
      <div class="tag-badge">
        <span class="tag-hash">#</span>
        <h1 class="tag-name">{data.tag}</h1>
      </div>
      <p class="tag-count">共 {data.posts.length} 篇文章</p>
      <a href="{base}/tags" class="tag-back">← 返回所有标签</a>
    </header>

    <div class="posts-grid">
      {#each data.posts as post}
        <a href="{base}/blog/{post.slug}" class="post-card">
          <time class="card-date">
            {new Date(post.metadata.date).toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' })}
          </time>
          <h2 class="card-title">{post.metadata.title}</h2>
          <p class="card-desc">{post.metadata.description}</p>
          <div class="card-tags">
            {#each post.metadata.tags as tag}
              <span class="tag">{tag}</span>
            {/each}
          </div>
        </a>
      {/each}
    </div>
  </div>
{:else}
  <!-- 文章展示模式 -->
  <article class="post-article">
    <header class="post-header">
      <h1 class="post-title">{data.metadata.title}</h1>
      <div class="post-meta-bar">
        <time>{new Date(data.metadata.date).toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' })}</time>
        <span class="meta-sep">·</span>
        <span>{data.metadata.author}</span>
        {#if data.metadata.tags?.length}
          <span class="meta-sep">·</span>
          <div class="post-tags">
            {#each data.metadata.tags as tag}
              <a href="/tags/{tag}" class="post-tag">#{tag}</a>
            {/each}
          </div>
        {/if}
      </div>
    </header>

    <div class="post-content" use:highlight>
      {#key data.metadata.slug}
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
  </article>
{/if}

<style>
  .tag-page {
    max-width: 1200px; margin: 0 auto; padding: 1rem 0;
  }
  .tag-header {
    margin-bottom: 2.5rem;
  }
  .tag-badge {
    display: inline-flex; align-items: center; gap: 0.5rem;
    padding: 0.5rem 0.9rem;
    background: var(--color-bg-secondary);
    border: 1px solid var(--color-border);
    border-radius: 8px; margin-bottom: 0.75rem;
  }
  .tag-hash { font-size: 1.5rem; color: var(--color-text-muted); font-weight: 700; }
  .tag-name { font-size: 1.8rem; font-weight: 700; color: var(--color-text-primary); }
  .tag-count { color: var(--color-text-muted); font-size: 1rem; margin-bottom: 1rem; }
  .tag-back { color: var(--color-accent); text-decoration: none; font-size: 0.9rem; }
  .tag-back:hover { color: var(--color-text-primary); }

  .posts-grid {
    display: grid; grid-template-columns: 1fr; gap: 1rem;
  }
  @media (min-width: 640px) { .posts-grid { grid-template-columns: repeat(2, 1fr); } }
  @media (min-width: 1024px) { .posts-grid { grid-template-columns: repeat(3, 1fr); } }

  .post-card {
    display: flex; flex-direction: column; padding: 1.25rem;
    background: var(--color-bg-card);
    border: 1px solid var(--color-border);
    border-radius: 8px;
    text-decoration: none;
    box-shadow: var(--shadow-card);
    transition: all 0.2s ease;
  }
  .post-card:hover {
    border-color: var(--color-border-hover);
    background: var(--color-bg-secondary);
  }
  .card-date { font-size: 0.82rem; color: var(--color-text-subtle); margin-bottom: 0.5rem; display: block; }
  .card-title { font-size: 1.15rem; font-weight: 600; color: var(--color-text-primary); margin-bottom: 0.5rem; line-height: 1.4; }
  .card-desc {
    font-size: 0.88rem; color: var(--color-text-muted); line-height: 1.5;
    flex: 1; overflow: hidden; margin-bottom: 1rem;
    display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; line-clamp: 3;
  }
  .card-tags { display: flex; gap: 0.3rem; flex-wrap: wrap; }
  .tag {
    padding: 0.15rem 0.5rem;
    background: var(--color-bg-secondary);
    border: 1px solid var(--color-border);
    border-radius: 6px;
    font-size: 0.72rem;
    color: var(--color-text-muted);
  }

  /* 文章模式 */
  .post-article { max-width: 860px; margin: 0 auto; padding: 1rem 0 3rem; }
  .post-header { margin-bottom: 2.5rem; text-align: center; }
  .post-title { font-size: 2.2rem; font-weight: 800; color: var(--color-text-primary); line-height: 1.2; margin-bottom: 1rem; }
  .post-meta-bar { display: flex; align-items: center; justify-content: center; gap: 0.5rem; flex-wrap: wrap; color: var(--color-text-muted); font-size: 0.9rem; }
  .meta-sep { color: var(--color-text-dim); }
  .post-tags { display: flex; gap: 0.4rem; flex-wrap: wrap; }
  .post-tag { color: var(--color-accent-light); text-decoration: none; font-size: 0.85rem; }
  .post-tag:hover { color: var(--color-accent); }
  .post-content {
    background: var(--color-bg-primary);
  }

  .state-box { display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 200px; color: var(--color-text-muted); }
  .state-box.error p { color: #f87171; }
  .spinner {
    width: 36px; height: 36px;
    border: 3px solid rgba(255,255,255,0.05);
    border-top-color: var(--color-accent);
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
    margin-bottom: 0.75rem;
  }
  @keyframes spin { to { transform: rotate(360deg); } }
</style>
