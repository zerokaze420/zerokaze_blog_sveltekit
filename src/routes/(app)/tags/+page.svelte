<script lang="ts">
    import type { PageData } from './$types';
    import { base } from '$app/paths';

    let { data } = $props<{ data: PageData }>();

    interface PostMeta {
      slug: string;
      metadata: {
        title: string;
        date: string;
        description: string;
        tags: string[];
        author: string;
      };
    }

    const posts = data.posts as PostMeta[];
</script>

<svelte:head>
  <title>标签 - Zerokaze Blog</title>
  <meta name="description" content="按标签浏览博客文章" />
</svelte:head>

<div class="tags-page">
  <header class="page-header">
    <h1 class="page-title">🏷️ 标签</h1>
    <p class="page-desc">按主题分类浏览文章</p>
  </header>

  <!-- 标签索引 -->
  <div class="tag-index">
    {#each [...new Set(posts.flatMap((p: PostMeta) => p.metadata.tags))].sort() as tag}
      {@const count = posts.filter((p: PostMeta) => p.metadata.tags?.includes(tag)).length}
      <a href="{base}/tags/{tag}" class="tag-pill">
        {tag}
        <span class="tag-count">{count}</span>
      </a>
    {/each}
  </div>

  <!-- 文章网格 -->
  <div class="posts-grid">
    {#each posts as post}
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

<style>
  .tags-page {
    max-width: 1200px;
    margin: 0 auto;
    padding: 1rem 0;
  }

  .page-header {
    text-align: center;
    margin-bottom: 2rem;
  }

  .page-title {
    font-size: 2rem;
    font-weight: 700;
    color: #f1f5f9;
    margin-bottom: 0.5rem;
  }

  .page-desc {
    color: #94a3b8;
    font-size: 1rem;
  }

  .tag-index {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 0.6rem;
    margin-bottom: 2.5rem;
  }

  .tag-pill {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    padding: 0.4rem 1rem;
    background: rgba(96, 165, 250, 0.08);
    border: 1px solid rgba(96, 165, 250, 0.15);
    border-radius: 999px;
    font-size: 0.9rem;
    color: #93c5fd;
    text-decoration: none;
    transition: all 0.2s;
  }

  .tag-pill:hover {
    background: rgba(96, 165, 250, 0.18);
    border-color: rgba(96, 165, 250, 0.3);
    transform: translateY(-1px);
  }

  .tag-count {
    background: rgba(96, 165, 250, 0.2);
    padding: 0.05rem 0.45rem;
    border-radius: 999px;
    font-size: 0.75rem;
    color: #60a5fa;
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
</style>
