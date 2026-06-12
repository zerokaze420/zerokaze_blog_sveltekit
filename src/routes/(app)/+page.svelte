<script lang="ts">
  import { base } from '$app/paths';
  import Icons from '$lib/components/Icons.svelte';
  import type { PageData } from './$types';

  let { data } = $props<{ data: PageData }>();
  let sortedTagCounts = $derived(
    (Object.entries(data.tagCounts) as [string, number][]).sort(([, a], [, b]) => b - a)
  );
</script>

<svelte:head>
  <title>Zerokaze Blog - 首页</title>
  <meta name="description" content="Zerokaze 技术手稿馆，收藏 Linux、开源、前端与工程实践笔记" />
</svelte:head>

<section class="hero">
  <div class="hero-art" aria-hidden="true">
    <img src="{base}/wallhaven-qr6z7d.jpg" alt="" />
  </div>
  <div class="hero-inner">
    <div class="hero-badge"><Icons name="pen" size={14} /> 雨季里的技术手稿</div>
    <h1 class="hero-title">
      <span class="hero-name">Zerokaze Archive</span>
    </h1>
    <p class="hero-desc">把命令、发行版与前端札记收进同一座索引，像潮湿年代里反复翻开的手稿。</p>
    <div class="hero-actions">
      <a href="{base}/blog" class="btn-primary">
        翻阅手稿
        <Icons name="arrow-right" size={16} />
      </a>
      <a href="{base}/about" class="btn-secondary">站点档案</a>
    </div>
  </div>

  <div class="hero-panel" aria-label="博客统计">
    <div class="hero-stats">
      <div class="hero-stat">
        <span class="stat-val">{data.totalPosts}</span>
        <span class="stat-lbl">篇文章</span>
      </div>
      <div class="hero-stat">
        <span class="stat-val">{Object.keys(data.tagCounts).length}</span>
        <span class="stat-lbl">标签</span>
      </div>
    </div>
    <p>每一篇笔记都像一枚被雨水洗亮的坐标，指向系统、工具与界面的某个清晨。</p>
  </div>
</section>

<div class="content-grid">
  <aside class="sidebar">
    <div class="card">
      <div class="card-header">
        <span class="card-icon"><Icons name="tag" size={18} /></span>
        <h2 class="card-h2">标签云</h2>
      </div>
      <div class="card-body">
        <div class="tag-cloud">
          {#each sortedTagCounts as [tag, count]}
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
      <h2 class="section-title"><Icons name="book" size={22} /> 最新文章</h2>
      <a href="{base}/blog" class="section-link">查看全部 <Icons name="chevron-right" size={14} /></a>
    </div>
    <div class="post-list">
      {#each data.recentPosts as post, i}
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
          <span class="post-link">阅读全文 <Icons name="arrow-right" size={14} /></span>
        </a>
      {/each}
    </div>
  </section>
</div>

<style>
  .hero {
    max-width: 1200px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    gap: 1.5rem;
    padding: 3rem 1rem 2rem;
    position: relative;
  }
  @media (min-width: 900px) {
    .hero {
      grid-template-columns: minmax(0, 1fr) 360px;
      align-items: end;
      padding-top: 4rem;
    }
  }
  .hero-art {
    position: absolute;
    inset: 1rem 1rem auto auto;
    width: min(42vw, 520px);
    height: 260px;
    border: 1px solid var(--color-border);
    border-radius: 8px;
    overflow: hidden;
    opacity: 0.22;
    z-index: -1;
  }
  .hero-art img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    filter: saturate(0.75) contrast(0.92);
  }
  .hero-inner { max-width: 760px; }
  .hero-badge {
    display: inline-flex; align-items: center; gap: 0.45rem;
    padding: 0.28rem 0.65rem;
    background: var(--color-bg-secondary);
    border: 1px solid var(--color-border);
    border-radius: 8px; font-size: 0.82rem;
    color: var(--color-text-muted);
    margin-bottom: 1.25rem;
  }
  .hero-title { margin-bottom: 1rem; }
  .hero-name {
    font-size: clamp(2.4rem, 7vw, 4.8rem);
    font-weight: 800;
    color: var(--color-text-primary);
    line-height: 0.98;
    letter-spacing: 0;
  }
  .hero-desc { max-width: 40rem; color: var(--color-text-muted); font-size: 1.08rem; margin-bottom: 1.5rem; line-height: 1.75; }
  .hero-panel {
    border: 1px solid var(--color-border);
    border-radius: 8px;
    background: var(--color-bg-card);
    box-shadow: var(--shadow-card);
    padding: 1rem;
  }
  .hero-panel p { margin-top: 1rem; color: var(--color-text-muted); font-size: 0.9rem; line-height: 1.65; }
  .hero-stats { display: grid; grid-template-columns: repeat(2, 1fr); gap: 0; }
  .hero-stat { display: flex; flex-direction: column; gap: 0.2rem; padding: 0.5rem; }
  .hero-stat + .hero-stat { border-left: 1px solid var(--color-border); }
  .stat-val { font-size: 1.55rem; font-weight: 700; color: var(--color-text-primary); }
  .stat-lbl { font-size: 0.78rem; color: var(--color-text-subtle); }
  .hero-actions { display: flex; gap: 0.75rem; flex-wrap: wrap; }
  .btn-primary {
    display: inline-flex; align-items: center; gap: 0.5rem;
    height: 2.5rem;
    padding: 0 1rem;
    background: var(--color-text-primary);
    border: 1px solid var(--color-text-primary);
    border-radius: 8px; color: var(--color-bg-primary); font-weight: 600; text-decoration: none;
    transition: all 0.2s ease;
  }
  .btn-primary:hover { background: var(--color-text-secondary); border-color: var(--color-text-secondary); }
  .btn-secondary {
    display: inline-flex; align-items: center;
    height: 2.5rem;
    padding: 0 1rem;
    background: transparent;
    border: 1px solid var(--color-border);
    border-radius: 8px; color: var(--color-text-primary); font-weight: 500; text-decoration: none;
    transition: all 0.2s;
  }
  .btn-secondary:hover { background: var(--color-bg-secondary); }

  .content-grid { max-width: 1200px; margin: 0 auto; display: grid; grid-template-columns: 1fr; gap: 2rem; padding: 1rem; }
  @media (min-width: 1024px) { .content-grid { grid-template-columns: 280px 1fr; } }

  .sidebar { display: flex; flex-direction: column; gap: 1.5rem; }
  .card { background: var(--color-bg-card); border: 1px solid var(--color-border); border-radius: 8px; overflow: hidden; box-shadow: var(--shadow-card); }
  .card-header { display: flex; align-items: center; gap: 0.5rem; padding: 1rem 1.25rem; border-bottom: 1px solid var(--color-border); }
  .card-icon { font-size: 1.2rem; }
  .card-h2 { font-size: 1rem; font-weight: 600; color: var(--color-text-secondary); }
  .card-body { padding: 1rem 1.25rem; }

  .tag-cloud { display: flex; flex-wrap: wrap; gap: 0.5rem; }
  .tag-item {
    display: inline-flex; align-items: center; gap: 0.3rem;
    padding: 0.3rem 0.7rem;
    background: var(--color-bg-secondary);
    border: 1px solid var(--color-border);
    border-radius: 8px;
    font-size: calc(0.75rem * var(--tag-size, 1));
    color: var(--color-text-secondary);
    text-decoration: none;
    transition: all 0.2s;
  }
  .tag-item:hover { background: var(--color-bg-glass); border-color: var(--color-border-hover); color: var(--color-text-primary); }
  .tag-num { font-size: 0.7rem; color: var(--color-text-subtle); }

  .section-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.25rem; }
  .section-title { font-size: 1.4rem; font-weight: 700; color: var(--color-text-secondary); }
  .section-link { color: var(--color-accent); text-decoration: none; font-size: 0.9rem; }
  .section-link:hover { color: var(--color-accent-light); }

  .post-list { display: flex; flex-direction: column; gap: 0.75rem; }
  .post-item {
    display: block; padding: 1.25rem;
    background: var(--color-bg-card);
    border: 1px solid var(--color-border);
    border-radius: 8px;
    text-decoration: none;
    transition: all 0.2s ease;
    animation: fadeUp 0.4s ease-out both;
    animation-delay: calc(var(--i, 0) * 0.08s);
  }
  @keyframes fadeUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
  .post-item:hover { border-color: var(--color-border-hover); background: var(--color-bg-secondary); }
  .post-meta { display: flex; align-items: center; gap: 0.75rem; margin-bottom: 0.5rem; font-size: 0.8rem; color: var(--color-text-subtle); }
  .post-tags-sm { display: flex; gap: 0.3rem; }
  .tag-sm { padding: 0.1rem 0.45rem; background: var(--color-bg-secondary); border: 1px solid var(--color-border); border-radius: 6px; font-size: 0.7rem; color: var(--color-text-muted); }
  .post-title { font-size: 1.1rem; font-weight: 600; color: var(--color-text-primary); margin-bottom: 0.35rem; line-height: 1.4; }
  .post-desc { font-size: 0.88rem; color: var(--color-text-muted); margin-bottom: 0.5rem; overflow: hidden; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; line-clamp: 2; }
  .post-link { font-size: 0.85rem; color: var(--color-accent); font-weight: 500; }

  @media (max-width: 900px) {
    .hero-art {
      position: relative;
      inset: auto;
      width: 100%;
      height: 180px;
      grid-row: 2;
      opacity: 0.34;
    }
  }
</style>
