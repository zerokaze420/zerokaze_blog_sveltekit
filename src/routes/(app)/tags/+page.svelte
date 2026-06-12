<script lang="ts">
    import type { PageData } from './$types';
    import { base } from '$app/paths';
    import Icons from '$lib/components/Icons.svelte';

    let { data } = $props<{ data: PageData }>();

    interface PostMeta {
      slug: string;
      metadata: { title: string; date: string; description: string; tags: string[]; author: string; };
    }

    const posts = data.posts as PostMeta[];
</script>

<svelte:head>
  <title>标签 - Zerokaze Blog</title>
  <meta name="description" content="按标签浏览博客文章" />
</svelte:head>

<div class="tags-page">
  <header class="page-header">
    <h1 class="page-title"><Icons name="tag" size={26} /> 标签</h1>
    <p class="page-desc">按主题分类浏览文章</p>
  </header>

  <div class="tag-index">
    {#each [...new Set(posts.flatMap((p: PostMeta) => p.metadata.tags))].sort() as tag}
      {@const count = posts.filter((p: PostMeta) => p.metadata.tags?.includes(tag)).length}
      <a href="{base}/tags/{tag}" class="tag-pill">
        {tag} <span class="tag-count">{count}</span>
      </a>
    {/each}
  </div>

  <div class="posts-grid">
    {#each posts as post}
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

<style>
  .tags-page { max-width: 1200px; margin: 0 auto; padding: 1rem 0; }
  .page-header { margin-bottom: 2rem; }
  .page-title { display: inline-flex; align-items: center; gap: 0.5rem; font-size: 2rem; font-weight: 700; color: var(--color-text-primary); margin-bottom: 0.5rem; }
  .page-desc { color: var(--color-text-muted); font-size: 1rem; }

  .tag-index { display: flex; flex-wrap: wrap; gap: 0.6rem; margin-bottom: 2.5rem; }
  .tag-pill {
    display: inline-flex; align-items: center; gap: 0.4rem;
    padding: 0.4rem 0.75rem;
    background: var(--color-bg-card);
    border: 1px solid var(--color-border);
    border-radius: 8px;
    font-size: 0.9rem;
    color: var(--color-text-secondary);
    text-decoration: none;
    transition: all 0.2s;
  }
  .tag-pill:hover {
    background: var(--color-bg-secondary);
    border-color: var(--color-border-hover);
    color: var(--color-text-primary);
  }
  .tag-count {
    background: var(--color-bg-secondary);
    padding: 0.05rem 0.45rem;
    border-radius: 6px;
    font-size: 0.75rem;
    color: var(--color-text-muted);
  }

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
</style>
