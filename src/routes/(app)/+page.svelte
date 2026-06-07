<script lang="ts">
  import { onMount } from 'svelte';
  import { base } from '$app/paths';
  import Wakatime from "$lib/components/Wakatime.svelte";

  interface PostEntry {
    slug: string;
    title: string;
    date: string;
    description: string;
    tags: string[];
  }

  let recentPosts = $state<PostEntry[]>([]);
  let tagCounts = $state<Record<string, number>>({});
  let totalPosts = $state(0);

  onMount(() => {
    try {
      const modules = import.meta.glob('/src/lib/posts/*.md', { eager: true }) as Record<string, any>;
      const allPosts: PostEntry[] = Object.entries(modules).map(([path, module]) => {
        const slug = path.split('/').pop()?.slice(0, -3) ?? '';
        const meta = module.metadata ?? {};
        return {
          slug,
          title: meta.title ?? '',
          date: meta.publishDate || meta.date || '',
          description: meta.description ?? '',
          tags: meta.tags ?? []
        };
      });

      allPosts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      recentPosts = allPosts.slice(0, 5);
      totalPosts = allPosts.length;

      // 统计标签
      const counts: Record<string, number> = {};
      for (const post of allPosts) {
        for (const tag of post.tags) {
          counts[tag] = (counts[tag] || 0) + 1;
        }
      }
      tagCounts = counts;
    } catch (err) {
      console.error('Failed to load posts:', err);
    }
  });
</script>

<svelte:head>
  <title>Zerokaze Blog - 首页</title>
  <meta name="description" content="Zerokaze 的个人技术博客，分享编程、Linux、前端等技术文章" />
</svelte:head>

<!-- Hero 区域 -->
<section class="hero-section">
  <div class="hero-content">
    <div class="hero-badge">✨ 个人技术博客</div>
    <h1 class="hero-title">
      <span class="hero-greeting">Hi, I'm</span>
      <span class="hero-name">Zerokaze</span>
    </h1>
    <p class="hero-desc">
      运维开发 & 系统测试 · Linux 爱好者 · 开源贡献者
    </p>
    <div class="hero-stats">
      <div class="hero-stat">
        <span class="stat-value">{totalPosts}</span>
        <span class="stat-label">篇文章</span>
      </div>
      <div class="hero-stat">
        <span class="stat-value">{Object.keys(tagCounts).length}</span>
        <span class="stat-label">标签</span>
      </div>
      <div class="hero-stat">
        <span class="stat-value">6+</span>
        <span class="stat-label">年 Linux 经验</span>
      </div>
    </div>
    <div class="hero-actions">
      <a href="{base}/blog" class="btn-primary">
        浏览文章
        <svg xmlns="http://www.w3.org/2000/svg" class="btn-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
        </svg>
      </a>
      <a href="{base}/about" class="btn-secondary">
        关于我
      </a>
    </div>
  </div>
</section>

<!-- 内容区域 -->
<div class="content-grid">
  <!-- 侧边栏 -->
  <aside class="sidebar">
    <!-- Wakatime 学习进度 -->
    <div class="card">
      <div class="card-header">
        <span class="card-icon">📊</span>
        <h2 class="card-title">学习进度</h2>
      </div>
      <div class="card-body">
        <Wakatime />
      </div>
    </div>

    <!-- 标签云 -->
    <div class="card">
      <div class="card-header">
        <span class="card-icon">🏷️</span>
        <h2 class="card-title">标签云</h2>
      </div>
      <div class="card-body">
        <div class="tag-cloud">
          {#each Object.entries(tagCounts).sort(([,a], [,b]) => b - a) as [tag, count]}
            <a
              href="{base}/tags/{tag}"
              class="tag-item"
              style="--tag-size: {Math.min(1 + count * 0.2, 1.6)}"
            >
              {tag}
              <span class="tag-count">{count}</span>
            </a>
          {/each}
        </div>
      </div>
    </div>
  </aside>

  <!-- 主区域：最新文章 -->
  <section class="main-content">
    <div class="section-header">
      <h2 class="section-title">📝 最新文章</h2>
      <a href="{base}/blog" class="section-link">查看全部 →</a>
    </div>

    <div class="post-list">
      {#each recentPosts as post, i}
        <a href="{base}/blog/{post.slug}" class="post-card" style="--i: {i}">
          <div class="post-meta">
            <time class="post-date">
              {new Date(post.date).toLocaleDateString('zh-CN', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit'
              })}
            </time>
            <div class="post-tags">
              {#each post.tags.slice(0, 2) as tag}
                <span class="post-tag">{tag}</span>
              {/each}
            </div>
          </div>
          <h3 class="post-title">{post.title}</h3>
          <p class="post-desc">{post.description}</p>
          <span class="post-readmore">阅读全文 →</span>
        </a>
      {/each}
    </div>
  </section>
</div>

<style>
  /* ========== Hero ========== */
  .hero-section {
    text-align: center;
    padding: 4rem 1rem 3rem;
    position: relative;
    overflow: hidden;
  }

  .hero-section::before {
    content: '';
    position: absolute;
    top: -50%;
    left: 50%;
    transform: translateX(-50%);
    width: 600px;
    height: 600px;
    background: radial-gradient(circle, rgba(96, 165, 250, 0.06), transparent 70%);
    pointer-events: none;
  }

  .hero-content {
    position: relative;
    z-index: 1;
  }

  .hero-badge {
    display: inline-block;
    padding: 0.3rem 1rem;
    background: rgba(96, 165, 250, 0.1);
    border: 1px solid rgba(96, 165, 250, 0.2);
    border-radius: 999px;
    font-size: 0.85rem;
    color: #93c5fd;
    margin-bottom: 1.5rem;
  }

  .hero-title {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    margin-bottom: 1rem;
  }

  .hero-greeting {
    font-size: 1.3rem;
    font-weight: 400;
    color: #94a3b8;
  }

  .hero-name {
    font-size: 3.5rem;
    font-weight: 800;
    background: linear-gradient(135deg, #60a5fa, #a78bfa, #f472b6);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    line-height: 1.1;
  }

  .hero-desc {
    color: #94a3b8;
    font-size: 1.1rem;
    margin-bottom: 2rem;
  }

  .hero-stats {
    display: flex;
    justify-content: center;
    gap: 2.5rem;
    margin-bottom: 2rem;
  }

  .hero-stat {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .stat-value {
    font-size: 1.8rem;
    font-weight: 700;
    color: #e2e8f0;
  }

  .stat-label {
    font-size: 0.85rem;
    color: #64748b;
  }

  .hero-actions {
    display: flex;
    justify-content: center;
    gap: 1rem;
    flex-wrap: wrap;
  }

  .btn-primary {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1.5rem;
    background: linear-gradient(135deg, #3b82f6, #8b5cf6);
    border-radius: 10px;
    color: white;
    font-weight: 600;
    text-decoration: none;
    transition: all 0.3s ease;
    border: none;
  }

  .btn-primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(96, 165, 250, 0.3);
  }

  .btn-icon {
    width: 18px;
    height: 18px;
    transition: transform 0.2s;
  }

  .btn-primary:hover .btn-icon {
    transform: translateX(3px);
  }

  .btn-secondary {
    display: inline-flex;
    align-items: center;
    padding: 0.75rem 1.5rem;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 10px;
    color: #94a3b8;
    font-weight: 500;
    text-decoration: none;
    transition: all 0.2s;
  }

  .btn-secondary:hover {
    background: rgba(255, 255, 255, 0.1);
    color: #e2e8f0;
  }

  /* ========== Content Grid ========== */
  .content-grid {
    max-width: 1200px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: 1fr;
    gap: 2rem;
    padding: 1rem;
  }

  @media (min-width: 1024px) {
    .content-grid {
      grid-template-columns: 300px 1fr;
    }
  }

  /* ========== Sidebar Cards ========== */
  .sidebar {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .card {
    background: rgba(30, 41, 59, 0.6);
    backdrop-filter: blur(12px);
    border: 1px solid rgba(255, 255, 255, 0.06);
    border-radius: 16px;
    overflow: hidden;
  }

  .card-header {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 1rem 1.25rem;
    border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  }

  .card-icon {
    font-size: 1.2rem;
  }

  .card-title {
    font-size: 1rem;
    font-weight: 600;
    color: #e2e8f0;
  }

  .card-body {
    padding: 1rem 1.25rem;
  }

  /* ========== Tag Cloud ========== */
  .tag-cloud {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  .tag-item {
    display: inline-flex;
    align-items: center;
    gap: 0.3rem;
    padding: 0.3rem 0.7rem;
    background: rgba(96, 165, 250, 0.08);
    border: 1px solid rgba(96, 165, 250, 0.12);
    border-radius: 999px;
    font-size: calc(0.75rem * var(--tag-size, 1));
    color: #93c5fd;
    text-decoration: none;
    transition: all 0.2s;
  }

  .tag-item:hover {
    background: rgba(96, 165, 250, 0.18);
    border-color: rgba(96, 165, 250, 0.3);
  }

  .tag-count {
    font-size: 0.7rem;
    color: #64748b;
  }

  /* ========== Main Content ========== */
  .section-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 1.25rem;
  }

  .section-title {
    font-size: 1.4rem;
    font-weight: 700;
    color: #e2e8f0;
  }

  .section-link {
    color: #60a5fa;
    text-decoration: none;
    font-size: 0.9rem;
    transition: color 0.2s;
  }

  .section-link:hover {
    color: #93c5fd;
  }

  .post-list {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .post-card {
    display: block;
    padding: 1.25rem;
    background: rgba(30, 41, 59, 0.5);
    backdrop-filter: blur(8px);
    border: 1px solid rgba(255, 255, 255, 0.06);
    border-radius: 12px;
    text-decoration: none;
    transition: all 0.3s ease;
    animation: fadeInUp 0.4s ease-out both;
    animation-delay: calc(var(--i, 0) * 0.08s);
  }

  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(12px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .post-card:hover {
    border-color: rgba(96, 165, 250, 0.3);
    transform: translateY(-2px);
    background: rgba(30, 41, 59, 0.7);
  }

  .post-meta {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-bottom: 0.5rem;
  }

  .post-date {
    font-size: 0.8rem;
    color: #64748b;
  }

  .post-tags {
    display: flex;
    gap: 0.3rem;
  }

  .post-tag {
    padding: 0.1rem 0.45rem;
    background: rgba(96, 165, 250, 0.1);
    border-radius: 4px;
    font-size: 0.7rem;
    color: #93c5fd;
  }

  .post-title {
    font-size: 1.1rem;
    font-weight: 600;
    color: #f1f5f9;
    margin-bottom: 0.35rem;
    line-height: 1.4;
  }

  .post-desc {
    font-size: 0.88rem;
    color: #94a3b8;
    margin-bottom: 0.5rem;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .post-readmore {
    font-size: 0.85rem;
    color: #60a5fa;
    font-weight: 500;
  }
</style>
