<script lang="ts">
  import { onMount } from 'svelte';
  import { base } from '$app/paths';
  import Icons from '$lib/components/Icons.svelte';

  interface Post {
    slug: string;
    title: string;
    date: string;
    description: string;
    tags: string[];
    author: string;
  }

  let query = $state('');
  let allPosts = $state<Post[]>([]);
  let loaded = $state(false);

  onMount(() => {
    try {
      const modules = import.meta.glob('/src/lib/posts/*.md', { eager: true }) as Record<string, any>;
      allPosts = Object.entries(modules).map(([path, module]) => {
        const slug = path.split('/').pop()?.slice(0, -3) ?? '';
        const meta = module.metadata ?? {};
        return {
          slug,
          title: meta.title ?? '',
          date: meta.publishDate || meta.date || '',
          description: meta.description ?? '',
          tags: meta.tags ?? [],
          author: meta.author ?? ''
        };
      }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      loaded = true;
    } catch (e) {
      console.error('Search load error:', e);
    }
  });

  let results = $derived.by(() => {
    if (!query.trim()) return allPosts;
    const q = query.toLowerCase();
    return allPosts.filter(p =>
      p.title.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.tags.some(t => t.toLowerCase().includes(q))
    );
  });
</script>

<svelte:head>
  <title>搜索 - Zerokaze Blog</title>
</svelte:head>

<div class="search-page">
  <header class="search-header">
    <h1 class="search-title"><Icons name="search" size={24} /> 搜索文章</h1>
    <div class="search-box">
      <Icons name="search" size={18} />
      <input
        type="text"
        class="search-input"
        placeholder="搜索文章标题、描述或标签..."
        bind:value={query}
      />
      {#if query}
        <button class="search-clear" onclick={() => query = ''}>
          <Icons name="x" size={16} />
        </button>
      {/if}
    </div>
    <p class="search-hint">
      {loaded ? `共 ${results.length} 篇匹配` : '加载中...'}
    </p>
  </header>

  {#if results.length > 0}
    <div class="search-results">
      {#each results as post}
        <a href="{base}/blog/{post.slug}" class="result-card">
          <div class="result-meta">
            <time><Icons name="calendar" size={13} /> {new Date(post.date).toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' })}</time>
            <span class="result-author"><Icons name="user" size={13} /> {post.author}</span>
          </div>
          <h2 class="result-title">{post.title}</h2>
          <p class="result-desc">{post.description}</p>
          <div class="result-tags">
            {#each post.tags as tag}
              <span class="result-tag">{tag}</span>
            {/each}
          </div>
        </a>
      {/each}
    </div>
  {:else if loaded && query}
    <div class="search-empty">
      <p>未找到与 "<strong>{query}</strong>" 相关的文章</p>
    </div>
  {/if}
</div>

<style>
  .search-page {
    max-width: 800px;
    margin: 0 auto;
    padding: 2rem 1rem 3rem;
  }

  .search-header {
    text-align: center;
    margin-bottom: 2rem;
  }

  .search-title {
    font-size: 1.8rem;
    font-weight: 700;
    color: var(--color-text-primary);
    margin-bottom: 1.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
  }

  .search-box {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    max-width: 480px;
    margin: 0 auto 0.75rem;
    padding: 0.6rem 1rem;
    background: var(--color-bg-card);
    border: 1px solid var(--color-border);
    border-radius: 12px;
    transition: border-color 0.2s;
    color: var(--color-text-muted);
  }

  .search-box:focus-within {
    border-color: var(--color-accent);
    box-shadow: 0 0 0 3px rgba(96, 165, 250, 0.1);
  }

  .search-input {
    flex: 1;
    border: none;
    background: none;
    outline: none;
    font-size: 1rem;
    font-family: inherit;
    color: var(--color-text-primary);
  }

  .search-input::placeholder {
    color: var(--color-text-dim);
  }

  .search-clear {
    display: flex;
    padding: 0.2rem;
    background: none;
    border: none;
    color: var(--color-text-dim);
    cursor: pointer;
    border-radius: 4px;
  }

  .search-clear:hover {
    color: var(--color-text-muted);
  }

  .search-hint {
    font-size: 0.85rem;
    color: var(--color-text-subtle);
  }

  .search-results {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .result-card {
    display: block;
    padding: 1.25rem;
    background: var(--color-bg-secondary);
    border: 1px solid var(--color-border);
    border-radius: 12px;
    text-decoration: none;
    transition: all 0.2s;
  }

  .result-card:hover {
    border-color: var(--color-border-accent);
    background: var(--color-bg-card);
  }

  .result-meta {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    font-size: 0.8rem;
    color: var(--color-text-subtle);
    margin-bottom: 0.4rem;
  }

  .result-meta time {
    display: inline-flex;
    align-items: center;
    gap: 0.3rem;
  }

  .result-author {
    display: inline-flex;
    align-items: center;
    gap: 0.3rem;
  }

  .result-title {
    font-size: 1.1rem;
    font-weight: 600;
    color: var(--color-text-primary);
    margin-bottom: 0.35rem;
  }

  .result-desc {
    font-size: 0.88rem;
    color: var(--color-text-muted);
    margin-bottom: 0.5rem;
    line-height: 1.5;
  }

  .result-tags {
    display: flex;
    gap: 0.35rem;
    flex-wrap: wrap;
  }

  .result-tag {
    padding: 0.1rem 0.5rem;
    background: rgba(96, 165, 250, 0.08);
    border: 1px solid rgba(96, 165, 250, 0.12);
    border-radius: 999px;
    font-size: 0.7rem;
    color: var(--color-accent-light);
  }

  .search-empty {
    text-align: center;
    padding: 3rem 1rem;
    color: var(--color-text-muted);
  }

  .search-empty strong {
    color: var(--color-text-secondary);
  }
</style>
