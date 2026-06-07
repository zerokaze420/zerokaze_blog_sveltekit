<script lang="ts">
  import { onMount } from 'svelte';
  import { base } from '$app/paths';

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

<section class="hero">
  <div class="hero-inner">
    <div class="hero-badge">✨ 个人技术博客</div>
    <h1 class="hero-title">
      <span class="hero-greeting">Hi, I'm</span>
      <span class="hero-name">Zerokaze</span>
    </h1>
    <p class="hero-desc">Linux 爱好者 · 开源贡献者 · 技术分享</p>
    <div class="hero-stats">
      <div class="hero-stat">
        <span class="stat-val">{totalPosts}</span>
        <span class="stat-lbl">篇文章</span>
      </div>
      <div class="hero-stat">
        <span class="stat-val">{Object.keys(tagCounts).length}</span>
        <span class="stat-lbl">标签</span>
      </div>
      <div class="hero-stat">
        <span class="stat-val">6+</span>
        <span class="stat-lbl">年 Linux 经验</span>
      </div>
    </div>
    <div class="hero-actions">
      <a href="{base}/blog" class="btn-primary">
        浏览文章
        <svg class="btn-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path d="M13 7l5 5m0 0l-5 5m5-5H6"/>
        </svg>
      </a>
      <a href="{base}/about" class="btn-secondary">关于我</a>
    </div>
  </div>
</section>

<div class="content-grid">
  <aside class="sidebar">
    <div class="card">
      <div class="card-header">
        <span class="card-icon">🏷️</span>
        <h2 class="card-h2">标签云</h2>
      </div>
      <div class="card-body">
        <div class="tag-cloud">
          {#each Object.entries(tagCounts).sort(([,a], [,b]) => b - a) as [tag, count]}
            <a href="{base}/tags/{tag}" class="tag-item" style="--tag-size: {Math.min(1 + count * 0.2, 1.6)}">
              {tag}
              <span class="tag-num">{count}</span>
            </a>
          {/each}
        </div>
      </div>
    </div>
  </aside>

  <section class="main-content">
    <div class="section-header">
      <h2 class="section-title">📝 最新文章</h2>
      <a href="{base}/blog" class="section-link">查看全部 →</a>
    </div>
    <div class="post-list">
      {#each recentPosts as post, i}
        <a href="{base}/blog/{post.slug}" class="post-item" style="--i: {i}">
          <div class="post-meta">
            <time>{new Date(post.date).toLocaleDateString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit' })}</time>
            <div class="post-tags-sm">
              {#each post.tags.slice(0, 2) as tag}
                <span class="tag-sm">{tag}</span>
              {/each}
            </div>
          </div>
          <h3 class="post-title">{post.title}</h3>
          <p class="post-desc">{post.description}</p>
          <span class="post-link">阅读全文 →</span>
        </a>
      {/each}
    </div>
  </section>
</div>

<style>
  .hero { text-align: center; padding: 4rem 1rem 3rem; position: relative; overflow: hidden; }
  .hero::before {
    content: '';
    position: absolute; top: -50%; left: 50%; transform: translateX(-50%);
    width: 600px; height: 600px;
    background: radial-gradient(circle, rgba(96, 165, 250, 0.06), transparent 70%);
    pointer-events: none;
  }
  .hero-inner { position: relative; z-index: 1; }
  .hero-badge {
    display: inline-block; padding: 0.3rem 1rem;
    background: rgba(96, 165, 250, 0.1);
    border: 1px solid rgba(96, 165, 250, 0.2);
    border-radius: 999px; font-size: 0.85rem;
    color: var(--color-accent-light);
    margin-bottom: 1.5rem;
  }
  .hero-title { display: flex; flex-direction: column; gap: 0.25rem; margin-bottom: 1rem; }
  .hero-greeting { font-size: 1.3rem; font-weight: 400; color: var(--color-text-muted); }
  .hero-name {
    font-size: 3.5rem; font-weight: 800;
    background: linear-gradient(135deg, var(--color-accent-gradient-start), var(--color-accent-gradient-end), var(--color-accent-gradient-alt));
    -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
    line-height: 1.1;
  }
  .hero-desc { color: var(--color-text-muted); font-size: 1.1rem; margin-bottom: 2rem; }
  .hero-stats { display: flex; justify-content: center; gap: 2.5rem; margin-bottom: 2rem; }
  .hero-stat { display: flex; flex-direction: column; align-items: center; }
  .stat-val { font-size: 1.8rem; font-weight: 700; color: var(--color-text-secondary); }
  .stat-lbl { font-size: 0.85rem; color: var(--color-text-subtle); }
  .hero-actions { display: flex; justify-content: center; gap: 1rem; flex-wrap: wrap; }
  .btn-primary {
    display: inline-flex; align-items: center; gap: 0.5rem;
    padding: 0.75rem 1.5rem;
    background: linear-gradient(135deg, #3b82f6, #8b5cf6);
    border-radius: 10px; color: white; font-weight: 600; text-decoration: none;
    transition: all 0.3s ease;
  }
  .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 8px 25px rgba(96, 165, 250, 0.3); }
  .btn-icon { width: 18px; height: 18px; transition: transform 0.2s; }
  .btn-primary:hover .btn-icon { transform: translateX(3px); }
  .btn-secondary {
    display: inline-flex; align-items: center;
    padding: 0.75rem 1.5rem;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid var(--color-border);
    border-radius: 10px; color: var(--color-text-muted); font-weight: 500; text-decoration: none;
    transition: all 0.2s;
  }
  .btn-secondary:hover { background: rgba(255, 255, 255, 0.1); color: var(--color-text-secondary); }

  .content-grid { max-width: 1200px; margin: 0 auto; display: grid; grid-template-columns: 1fr; gap: 2rem; padding: 1rem; }
  @media (min-width: 1024px) { .content-grid { grid-template-columns: 280px 1fr; } }

  .sidebar { display: flex; flex-direction: column; gap: 1.5rem; }
  .card { background: var(--color-bg-card); backdrop-filter: blur(12px); border: 1px solid var(--color-border); border-radius: 16px; overflow: hidden; }
  .card-header { display: flex; align-items: center; gap: 0.5rem; padding: 1rem 1.25rem; border-bottom: 1px solid var(--color-border); }
  .card-icon { font-size: 1.2rem; }
  .card-h2 { font-size: 1rem; font-weight: 600; color: var(--color-text-secondary); }
  .card-body { padding: 1rem 1.25rem; }

  .tag-cloud { display: flex; flex-wrap: wrap; gap: 0.5rem; }
  .tag-item {
    display: inline-flex; align-items: center; gap: 0.3rem;
    padding: 0.3rem 0.7rem;
    background: rgba(96, 165, 250, 0.08);
    border: 1px solid rgba(96, 165, 250, 0.12);
    border-radius: 999px;
    font-size: calc(0.75rem * var(--tag-size, 1));
    color: var(--color-accent-light);
    text-decoration: none;
    transition: all 0.2s;
  }
  .tag-item:hover { background: rgba(96, 165, 250, 0.18); border-color: rgba(96, 165, 250, 0.3); }
  .tag-num { font-size: 0.7rem; color: var(--color-text-subtle); }

  .section-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.25rem; }
  .section-title { font-size: 1.4rem; font-weight: 700; color: var(--color-text-secondary); }
  .section-link { color: var(--color-accent); text-decoration: none; font-size: 0.9rem; }
  .section-link:hover { color: var(--color-accent-light); }

  .post-list { display: flex; flex-direction: column; gap: 0.75rem; }
  .post-item {
    display: block; padding: 1.25rem;
    background: var(--color-bg-secondary);
    backdrop-filter: blur(8px);
    border: 1px solid var(--color-border);
    border-radius: 12px;
    text-decoration: none;
    transition: all 0.3s ease;
    animation: fadeUp 0.4s ease-out both;
    animation-delay: calc(var(--i, 0) * 0.08s);
  }
  @keyframes fadeUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
  .post-item:hover { border-color: var(--color-border-accent); transform: translateY(-2px); background: var(--color-bg-glass); }
  .post-meta { display: flex; align-items: center; gap: 0.75rem; margin-bottom: 0.5rem; font-size: 0.8rem; color: var(--color-text-subtle); }
  .post-tags-sm { display: flex; gap: 0.3rem; }
  .tag-sm { padding: 0.1rem 0.45rem; background: rgba(96, 165, 250, 0.1); border-radius: 4px; font-size: 0.7rem; color: var(--color-accent-light); }
  .post-title { font-size: 1.1rem; font-weight: 600; color: var(--color-text-primary); margin-bottom: 0.35rem; line-height: 1.4; }
  .post-desc { font-size: 0.88rem; color: var(--color-text-muted); margin-bottom: 0.5rem; overflow: hidden; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; line-clamp: 2; }
  .post-link { font-size: 0.85rem; color: var(--color-accent); font-weight: 500; }
</style>
