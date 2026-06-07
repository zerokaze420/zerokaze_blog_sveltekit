<script lang="ts">
    import type { PageData } from './$types';
    import { base } from '$app/paths';
    import Icons from '$lib/components/Icons.svelte';

    let { data } = $props<{ data: PageData }>();
</script>

<svelte:head>
  <title>所有文章 - Zerokaze Blog</title>
  <meta name="description" content="Zerokaze 博客的所有文章" />
</svelte:head>

<div class="blog-page">
  <header class="page-header">
    <h1 class="page-title"><Icons name="book" size={26} /> 所有文章</h1>
    <p class="page-desc">共 {data.posts.length} 篇文章</p>
  </header>

  <div class="posts-grid">
    {#each data.posts as post}
      <a href="{base}/blog/{post.slug}" class="post-card">
        <div class="card-header">
          <time class="card-date">
            {new Date(post.metadata.date).toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' })}
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
          <span class="card-author">👤 {post.metadata.author}</span>
        </div>
      </a>
    {/each}
  </div>
</div>

<style>
  .blog-page { max-width: 1200px; margin: 0 auto; padding: 1rem 0; }
  .page-header { text-align: center; margin-bottom: 2.5rem; }
  .page-title { font-size: 2rem; font-weight: 700; color: var(--color-text-primary); margin-bottom: 0.5rem; }
  .page-desc { color: var(--color-text-muted); font-size: 1rem; }

  .posts-grid {
    display: grid; grid-template-columns: 1fr; gap: 1rem;
  }
  @media (min-width: 640px) { .posts-grid { grid-template-columns: repeat(2, 1fr); } }
  @media (min-width: 1024px) { .posts-grid { grid-template-columns: repeat(3, 1fr); } }

  .post-card {
    display: flex; flex-direction: column; padding: 1.25rem;
    background: var(--color-bg-secondary);
    backdrop-filter: blur(12px);
    border: 1px solid var(--color-border);
    border-radius: 14px;
    text-decoration: none;
    transition: all 0.3s ease;
  }
  .post-card:hover {
    border-color: var(--color-border-accent);
    transform: translateY(-3px);
    background: var(--color-bg-glass);
    box-shadow: 0 8px 30px rgba(0,0,0,0.2);
  }
  .card-header { margin-bottom: 0.75rem; }
  .card-date { font-size: 0.82rem; color: var(--color-text-subtle); }
  .card-title { font-size: 1.15rem; font-weight: 600; color: var(--color-text-primary); margin-bottom: 0.5rem; line-height: 1.4; }
  .card-desc {
    font-size: 0.88rem; color: var(--color-text-muted); line-height: 1.5;
    flex: 1; overflow: hidden; margin-bottom: 1rem;
    display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; line-clamp: 3;
  }
  .card-footer { display: flex; align-items: center; justify-content: space-between; gap: 0.5rem; flex-wrap: wrap; }
  .card-tags { display: flex; gap: 0.3rem; flex-wrap: wrap; }
  .tag {
    padding: 0.15rem 0.5rem;
    background: rgba(96, 165, 250, 0.1);
    border: 1px solid rgba(96, 165, 250, 0.15);
    border-radius: 999px;
    font-size: 0.72rem;
    color: var(--color-accent-light);
  }
  .card-author { font-size: 0.78rem; color: var(--color-text-subtle); white-space: nowrap; }
</style>
