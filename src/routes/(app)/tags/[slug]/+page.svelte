<script lang="ts">
  import type { PageData } from './$types';
  import { base } from '$app/paths';

  let { data } = $props<{ data: PageData }>();

  // 文章模式：加载文章内容
  const modules = import.meta.glob('/src/lib/posts/*.md') as Record<string, () => Promise<any>>;

  let postContentPromise: Promise<any> | undefined = $derived(
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
        <a
          href="{base}/blog/{post.slug}"
          class="post-card"
        >
          <div class="card-header">
            <time class="card-date">
              {new Date(post.metadata.date).toLocaleDateString('zh-CN', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </time>
          </div>
          <h2 class="card-title">{post.metadata.title}</h2>
          <p class="card-desc">{post.metadata.description}</p>
          <div class="card-footer">
            <div class="card-tags">
              {#each post.metadata.tags as tag}
                <span class="tag">{tag}</span>
              {/each}
            </div>
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
        <time class="post-date">
          📅 {new Date(data.metadata.date).toLocaleDateString('zh-CN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </time>
        <span class="meta-separator">·</span>
        <span class="post-author">✍️ {data.metadata.author}</span>
        {#if data.metadata.tags?.length}
          <span class="meta-separator">·</span>
          <div class="post-tags">
            {#each data.metadata.tags as tag}
              <a href="/tags/{tag}" class="post-tag">#{tag}</a>
            {/each}
          </div>
        {/if}
      </div>
    </header>

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
      {#key data.metadata.slug}
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
  </article>
{/if}

<style>
  /* ===== 标签过滤模式 ===== */
  .tag-page {
    max-width: 1200px;
    margin: 0 auto;
    padding: 1rem 0;
  }

  .tag-header {
    text-align: center;
    margin-bottom: 2.5rem;
  }

  .tag-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1.5rem;
    background: linear-gradient(135deg, rgba(96, 165, 250, 0.15), rgba(167, 139, 250, 0.15));
    border: 1px solid rgba(96, 165, 250, 0.25);
    border-radius: 999px;
    margin-bottom: 0.75rem;
  }

  .tag-hash {
    font-size: 1.5rem;
    color: #60a5fa;
    font-weight: 700;
  }

  .tag-name {
    font-size: 1.8rem;
    font-weight: 700;
    color: #f1f5f9;
  }

  .tag-count {
    color: #94a3b8;
    font-size: 1rem;
    margin-bottom: 1rem;
  }

  .tag-back {
    display: inline-block;
    color: #60a5fa;
    text-decoration: none;
    font-size: 0.9rem;
    transition: color 0.2s;
  }

  .tag-back:hover {
    color: #93c5fd;
  }

  .posts-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  @media (min-width: 640px) {
    .posts-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  @media (min-width: 1024px) {
    .posts-grid {
      grid-template-columns: repeat(3, 1fr);
    }
  }

  .post-card {
    display: flex;
    flex-direction: column;
    padding: 1.25rem;
    background: rgba(30, 41, 59, 0.5);
    backdrop-filter: blur(12px);
    border: 1px solid rgba(255, 255, 255, 0.06);
    border-radius: 14px;
    text-decoration: none;
    transition: all 0.3s ease;
  }

  .post-card:hover {
    border-color: rgba(96, 165, 250, 0.3);
    transform: translateY(-3px);
    background: rgba(30, 41, 59, 0.7);
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.2);
  }

  .card-header {
    margin-bottom: 0.75rem;
  }

  .card-date {
    font-size: 0.82rem;
    color: #64748b;
  }

  .card-title {
    font-size: 1.15rem;
    font-weight: 600;
    color: #f1f5f9;
    margin-bottom: 0.5rem;
    line-height: 1.4;
  }

  .card-desc {
    font-size: 0.88rem;
    color: #94a3b8;
    line-height: 1.5;
    flex: 1;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    line-clamp: 3;
    overflow: hidden;
    margin-bottom: 1rem;
  }

  .card-footer {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
  }

  .card-tags {
    display: flex;
    gap: 0.3rem;
    flex-wrap: wrap;
  }

  .tag {
    padding: 0.15rem 0.5rem;
    background: rgba(96, 165, 250, 0.1);
    border: 1px solid rgba(96, 165, 250, 0.15);
    border-radius: 999px;
    font-size: 0.72rem;
    color: #93c5fd;
  }

  /* ===== 文章模式 ===== */
  .post-article {
    max-width: 800px;
    margin: 0 auto;
    padding: 1rem 0 3rem;
  }

  .post-header {
    margin-bottom: 2.5rem;
    text-align: center;
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
</style>
