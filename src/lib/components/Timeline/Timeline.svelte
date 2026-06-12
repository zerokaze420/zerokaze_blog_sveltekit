<script lang="ts">
  import { base } from '$app/paths';
  import { onMount } from 'svelte';
  import Icons from '$lib/components/Icons.svelte';

  interface PostEntry {
    slug: string;
    title: string;
    date: string;
    publishDate: string;
    description: string;
    tags: string[];
    author: string;
  }

  let posts = $state<PostEntry[]>([]);
  let isLoading = $state(true);

  onMount(async () => {
    try {
      const modules = import.meta.glob('/src/lib/posts/*.md', { eager: true }) as Record<string, any>;

      const allPosts: PostEntry[] = Object.entries(modules).map(([path, module]) => {
        const slug = path.split('/').pop()?.slice(0, -3) ?? '';
        const meta = module.metadata ?? {};
        return {
          slug,
          title: meta.title ?? 'Untitled',
          date: meta.publishDate || meta.date || '',
          publishDate: meta.publishDate || '',
          description: meta.description ?? '',
          tags: meta.tags ?? [],
          author: meta.author ?? 'Unknown'
        };
      });

      allPosts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      posts = allPosts;
    } catch (err) {
      console.error('Failed to load posts for timeline:', err);
    } finally {
      isLoading = false;
    }
  });

  let groupedByYear = $derived.by(() => {
    const groups: Record<string, PostEntry[]> = {};
    for (const post of posts) {
      const year = post.date ? new Date(post.date).getFullYear().toString() : 'Unknown';
      if (!groups[year]) groups[year] = [];
      groups[year].push(post);
    }
    return Object.entries(groups).sort(([a], [b]) => Number(b) - Number(a));
  });
</script>

<div class="timeline-container">
  <h1 class="timeline-title"><Icons name="timeline" size={28} /> 博客时间线</h1>
  <p class="timeline-subtitle">按时间整理的技术手稿 · 共 {posts.length} 篇文章</p>

  {#if isLoading}
    <div class="loading-state">
      <div class="spinner"></div>
      <p>加载中...</p>
    </div>
  {:else if posts.length === 0}
    <div class="empty-state">
      <p>暂无文章</p>
    </div>
  {:else}
    <div class="timeline">
      <div class="timeline-line"></div>

      {#each groupedByYear as [year, yearPosts], yearIndex}
        <div class="year-marker">
          <div class="year-badge">{year}</div>
        </div>

        {#each yearPosts as post, postIndex}
          {@const isLeft = postIndex % 2 === 0}
          <a
            href="{base}/blog/{post.slug}"
            class="timeline-item"
            class:tl-left={isLeft}
            class:tl-right={!isLeft}
          >
            <div class="timeline-dot"></div>
            <div class="timeline-card">
              <div class="tl-date">
                <span class="date-badge">
                  <Icons name="calendar" size={12} />
                  {new Date(post.date).toLocaleDateString('zh-CN', {
                    year: 'numeric', month: 'long', day: 'numeric'
                  })}
                </span>
              </div>
              <h2 class="tl-card-title">{post.title}</h2>
              <p class="tl-desc">{post.description}</p>
              <div class="tl-footer">
                <span class="tl-author"><Icons name="user" size={13} /> {post.author}</span>
                <div class="tl-tags">
                  {#each post.tags.slice(0, 3) as tag}
                    <span class="tl-tag">{tag}</span>
                  {/each}
                  {#if post.tags.length > 3}
                    <span class="tl-tag tl-tag-more">+{post.tags.length - 3}</span>
                  {/if}
                </div>
              </div>
            </div>
          </a>
        {/each}
      {/each}
    </div>
  {/if}
</div>

<style>
  .timeline-container {
    max-width: 1000px;
    margin: 0 auto;
    padding: 2rem 1rem;
    color: var(--color-text-secondary);
  }

  .timeline-title {
    font-size: 2rem;
    font-weight: 700;
    margin-bottom: 0.5rem;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    gap: 0.5rem;
    color: var(--color-text-primary);
  }

  .timeline-subtitle {
    color: var(--color-text-muted);
    margin-bottom: 3rem;
    font-size: 1.1rem;
  }

  .loading-state,
  .empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 300px;
    color: var(--color-text-muted);
  }

  .spinner {
    width: 40px;
    height: 40px;
    border: 3px solid var(--color-border);
    border-top-color: var(--color-accent);
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
    margin-bottom: 1rem;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  .timeline {
    position: relative;
    padding: 1rem 0;
  }

  .timeline-line {
    position: absolute;
    left: 50%;
    top: 0;
    bottom: 0;
    width: 1px;
    background: var(--color-border);
    transform: translateX(-50%);
  }

  .year-marker {
    text-align: center;
    margin: 2rem 0 1.5rem;
    position: relative;
    z-index: 2;
  }

  .year-badge {
    display: inline-block;
    padding: 0.35rem 0.75rem;
    background: var(--color-bg-card);
    border: 1px solid var(--color-border);
    border-radius: 8px;
    font-size: 1rem;
    font-weight: 700;
    color: var(--color-text-primary);
  }

  .timeline-item {
    display: flex;
    position: relative;
    margin-bottom: 2rem;
    text-decoration: none;
    color: inherit;
    width: 100%;
  }

  .tl-left {
    justify-content: flex-start;
    padding-right: calc(50% + 2rem);
  }

  .tl-right {
    justify-content: flex-end;
    padding-left: calc(50% + 2rem);
  }

  .timeline-dot {
    position: absolute;
    left: 50%;
    top: 1.5rem;
    width: 13px;
    height: 13px;
    background: var(--color-accent);
    border: 3px solid var(--color-bg-primary);
    border-radius: 50%;
    transform: translateX(-50%);
    z-index: 2;
    transition: all 0.2s ease;
    box-shadow: 0 0 0 1px var(--color-border);
  }

  .timeline-item:hover .timeline-dot {
    background: var(--color-text-primary);
    transform: translateX(-50%) scale(1.15);
  }

  .timeline-card {
    background: var(--color-bg-card);
    border: 1px solid var(--color-border);
    border-radius: 8px;
    padding: 1.25rem;
    width: 100%;
    transition: all 0.2s ease;
    position: relative;
    box-shadow: var(--shadow-card);
  }

  .timeline-card::before {
    content: '';
    position: absolute;
    top: 1.2rem;
    width: 12px;
    height: 12px;
    background: var(--color-bg-glass);
    border: 1px solid var(--color-border);
    transform: rotate(45deg);
  }

  .tl-left .timeline-card::before {
    right: -7px;
    border-left: none;
    border-bottom: none;
  }

  .tl-right .timeline-card::before {
    left: -7px;
    border-right: none;
    border-top: none;
  }

  .timeline-card:hover {
    border-color: var(--color-border-hover);
    background: var(--color-bg-secondary);
  }

  .tl-date {
    margin-bottom: 0.5rem;
  }

  .date-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
    padding: 0.2rem 0.8rem;
    background: var(--color-bg-secondary);
    border: 1px solid var(--color-border);
    border-radius: 6px;
    font-size: 0.82rem;
    color: var(--color-text-muted);
  }

  .tl-card-title {
    font-size: 1.15rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
    color: var(--color-text-primary);
    line-height: 1.4;
  }

  .tl-desc {
    font-size: 0.88rem;
    color: var(--color-text-muted);
    margin-bottom: 0.75rem;
    line-height: 1.5;
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    line-clamp: 2;
  }

  .tl-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.5rem;
    flex-wrap: wrap;
  }

  .tl-author {
    display: inline-flex;
    align-items: center;
    gap: 0.3rem;
    font-size: 0.8rem;
    color: var(--color-text-subtle);
  }

  .tl-tags {
    display: flex;
    gap: 0.35rem;
    flex-wrap: wrap;
  }

  .tl-tag {
    padding: 0.15rem 0.5rem;
    background: var(--color-bg-secondary);
    border: 1px solid var(--color-border);
    border-radius: 6px;
    font-size: 0.7rem;
    color: var(--color-text-muted);
  }

  .tl-tag-more {
    background: var(--color-bg-card);
    border-color: var(--color-border);
    color: var(--color-text-muted);
  }

  @media (max-width: 768px) {
    .timeline-line {
      left: 1.5rem;
    }

    .tl-left, .tl-right {
      padding-left: 3.5rem;
      padding-right: 0;
      justify-content: flex-start;
    }

    .timeline-dot {
      left: 1.5rem;
    }

    .tl-left .timeline-card::before,
    .tl-right .timeline-card::before {
      left: -7px;
      right: auto;
      border-right: none;
      border-top: none;
      border-left: 1px solid var(--color-border);
      border-bottom: 1px solid var(--color-border);
    }

    .year-marker {
      text-align: left;
      padding-left: 3.5rem;
    }

    .timeline-title {
      font-size: 1.8rem;
    }
  }
</style>
