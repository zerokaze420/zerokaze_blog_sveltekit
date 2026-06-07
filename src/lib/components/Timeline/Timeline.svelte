<script lang="ts">
  import { base } from '$app/paths';
  import { onMount } from 'svelte';

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
      // 使用 Vite 的 glob 导入扫描所有文章
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

      // 按日期排序（最新的在前）
      allPosts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      posts = allPosts;
    } catch (err) {
      console.error('Failed to load posts for timeline:', err);
    } finally {
      isLoading = false;
    }
  });

  // 按年份分组
  let groupedByYear = $derived.by(() => {
    const groups: Record<string, PostEntry[]> = {};
    for (const post of posts) {
      const year = post.date ? new Date(post.date).getFullYear().toString() : 'Unknown';
      if (!groups[year]) groups[year] = [];
      groups[year].push(post);
    }
    // 年份降序
    return Object.entries(groups).sort(([a], [b]) => Number(b) - Number(a));
  });
</script>

<div class="timeline-container">
  <h1 class="timeline-title">📅 博客时间线</h1>
  <p class="timeline-subtitle">记录我的博客成长历程 · 共 {posts.length} 篇文章</p>

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
      <!-- 时间线中线 -->
      <div class="timeline-line"></div>

      {#each groupedByYear as [year, yearPosts], yearIndex}
        <!-- 年份标记 -->
        <div class="year-marker" class:year-even={yearIndex % 2 === 0}>
          <div class="year-badge">{year}</div>
        </div>

        {#each yearPosts as post, postIndex}
          {@const isLeft = postIndex % 2 === 0}
          <a
            href="{base}/blog/{post.slug}"
            class="timeline-item"
            class:timeline-left={isLeft}
            class:timeline-right={!isLeft}
          >
            <div class="timeline-dot"></div>
            <div class="timeline-card">
              <div class="card-date">
                <span class="date-badge">
                  {new Date(post.date).toLocaleDateString('zh-CN', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
              </div>
              <h2 class="card-title">{post.title}</h2>
              <p class="card-description">{post.description}</p>
              <div class="card-footer">
                <span class="card-author">✍️ {post.author}</span>
                <div class="card-tags">
                  {#each post.tags.slice(0, 3) as tag}
                    <span class="tag">{tag}</span>
                  {/each}
                  {#if post.tags.length > 3}
                    <span class="tag tag-more">+{post.tags.length - 3}</span>
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
    color: #e2e8f0;
  }

  .timeline-title {
    text-align: center;
    font-size: 2.5rem;
    font-weight: 700;
    margin-bottom: 0.5rem;
    background: linear-gradient(135deg, #60a5fa, #a78bfa);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .timeline-subtitle {
    text-align: center;
    color: #94a3b8;
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
    color: #94a3b8;
  }

  .spinner {
    width: 40px;
    height: 40px;
    border: 3px solid rgba(255, 255, 255, 0.1);
    border-top-color: #60a5fa;
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
    width: 3px;
    background: linear-gradient(180deg, #60a5fa, #a78bfa, #f472b6);
    transform: translateX(-50%);
    border-radius: 2px;
  }

  .year-marker {
    text-align: center;
    margin: 2rem 0 1.5rem;
    position: relative;
    z-index: 2;
  }

  .year-badge {
    display: inline-block;
    padding: 0.4rem 1.5rem;
    background: linear-gradient(135deg, rgba(96, 165, 250, 0.3), rgba(167, 139, 250, 0.3));
    border: 1px solid rgba(96, 165, 250, 0.4);
    border-radius: 999px;
    font-size: 1.3rem;
    font-weight: 700;
    color: #93c5fd;
    backdrop-filter: blur(10px);
  }

  .timeline-item {
    display: flex;
    position: relative;
    margin-bottom: 2rem;
    text-decoration: none;
    color: inherit;
    width: 100%;
  }

  .timeline-left {
    justify-content: flex-start;
    padding-right: calc(50% + 2rem);
  }

  .timeline-right {
    justify-content: flex-end;
    padding-left: calc(50% + 2rem);
  }

  .timeline-dot {
    position: absolute;
    left: 50%;
    top: 1.5rem;
    width: 16px;
    height: 16px;
    background: #60a5fa;
    border: 3px solid rgba(96, 165, 250, 0.3);
    border-radius: 50%;
    transform: translateX(-50%);
    z-index: 2;
    transition: all 0.3s ease;
    box-shadow: 0 0 12px rgba(96, 165, 250, 0.4);
  }

  .timeline-item:hover .timeline-dot {
    background: #f472b6;
    border-color: rgba(244, 114, 182, 0.4);
    box-shadow: 0 0 20px rgba(244, 114, 182, 0.6);
    transform: translateX(-50%) scale(1.3);
  }

  .timeline-card {
    background: rgba(30, 41, 59, 0.8);
    backdrop-filter: blur(16px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 16px;
    padding: 1.25rem;
    width: 100%;
    transition: all 0.3s ease;
    position: relative;
  }

  .timeline-card::before {
    content: '';
    position: absolute;
    top: 1.2rem;
    width: 12px;
    height: 12px;
    background: rgba(30, 41, 59, 0.9);
    border: 1px solid rgba(255, 255, 255, 0.1);
    transform: rotate(45deg);
  }

  .timeline-left .timeline-card::before {
    right: -7px;
    border-left: none;
    border-bottom: none;
  }

  .timeline-right .timeline-card::before {
    left: -7px;
    border-right: none;
    border-top: none;
  }

  .timeline-card:hover {
    border-color: rgba(96, 165, 250, 0.4);
    transform: translateY(-3px);
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.3);
  }

  .card-date {
    margin-bottom: 0.5rem;
  }

  .date-badge {
    display: inline-block;
    padding: 0.2rem 0.8rem;
    background: rgba(96, 165, 250, 0.15);
    border-radius: 999px;
    font-size: 0.85rem;
    color: #93c5fd;
  }

  .card-title {
    font-size: 1.2rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
    color: #f1f5f9;
    line-height: 1.4;
  }

  .card-description {
    font-size: 0.9rem;
    color: #94a3b8;
    margin-bottom: 0.75rem;
    line-height: 1.5;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .card-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.5rem;
    flex-wrap: wrap;
  }

  .card-author {
    font-size: 0.8rem;
    color: #64748b;
  }

  .card-tags {
    display: flex;
    gap: 0.35rem;
    flex-wrap: wrap;
  }

  .tag {
    padding: 0.15rem 0.5rem;
    background: rgba(96, 165, 250, 0.12);
    border: 1px solid rgba(96, 165, 250, 0.2);
    border-radius: 999px;
    font-size: 0.7rem;
    color: #93c5fd;
  }

  .tag-more {
    background: rgba(148, 163, 184, 0.12);
    border-color: rgba(148, 163, 184, 0.2);
    color: #94a3b8;
  }

  /* 移动端适配：单栏布局 */
  @media (max-width: 768px) {
    .timeline-line {
      left: 1.5rem;
    }

    .timeline-left,
    .timeline-right {
      padding-left: 3.5rem;
      padding-right: 0;
      justify-content: flex-start;
    }

    .timeline-dot {
      left: 1.5rem;
    }

    .timeline-left .timeline-card::before,
    .timeline-right .timeline-card::before {
      left: -7px;
      right: auto;
      border-right: none;
      border-top: none;
      border-left: 1px solid rgba(255, 255, 255, 0.1);
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
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
