<script lang="ts">
  import { onDestroy } from 'svelte';
  import type { PageData } from './$types';
  import { highlight } from '$lib/utils/highlight';
  import Icons from '$lib/components/Icons.svelte';

  type TocItem = {
    id: string;
    text: string;
    level: 2 | 3;
  };

  let { data } = $props<{ data: PageData }>();
  let postContentEl: HTMLDivElement | undefined = $state();
  let tocItems = $state<TocItem[]>([]);
  let activeHeadingId = $state('');
  let headingObserver: IntersectionObserver | undefined;

  const modules = import.meta.glob('/src/lib/posts/*.md') as Record<string, () => Promise<any>>;
  const path = `/src/lib/posts/${data.post.slug}.md`;
  const postContentPromise = modules[path]
    ? modules[path]()
    : Promise.reject(new Error(`找不到文章：${path}`));

  function slugifyHeading(text: string, index: number) {
    const normalized = text
      .trim()
      .toLowerCase()
      .replace(/[`~!@#$%^&*()+=[\]{};:'",.<>/?\\|]/g, '')
      .replace(/\s+/g, '-');

    return normalized || `heading-${index + 1}`;
  }

  function buildTableOfContents(node = postContentEl) {
    if (!node) return;

    headingObserver?.disconnect();

    const usedIds = new Map<string, number>();
    const headings = Array.from(node.querySelectorAll('h2, h3')) as HTMLHeadingElement[];
    const items = headings
      .map((heading, index) => {
        const text = heading.textContent?.trim() ?? '';
        if (!text) return null;

        const baseId = heading.id || slugifyHeading(text, index);
        const count = usedIds.get(baseId) ?? 0;
        usedIds.set(baseId, count + 1);
        const id = count === 0 ? baseId : `${baseId}-${count + 1}`;

        heading.id = id;
        return {
          id,
          text,
          level: Number(heading.tagName.slice(1)) as 2 | 3
        };
      })
      .filter((item): item is TocItem => item !== null);

    tocItems = items;
    activeHeadingId = items[0]?.id ?? '';

    headingObserver = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

        if (visible[0]?.target.id) {
          activeHeadingId = visible[0].target.id;
        }
      },
      {
        rootMargin: '-96px 0px -65% 0px',
        threshold: [0, 1]
      }
    );

    headings.forEach((heading) => headingObserver?.observe(heading));
  }

  function tableOfContents(node: HTMLDivElement) {
    postContentEl = node;

    const scheduleBuild = () => {
      requestAnimationFrame(() => buildTableOfContents(node));
    };

    scheduleBuild();

    const contentObserver = new MutationObserver(scheduleBuild);
    contentObserver.observe(node, { childList: true, subtree: true });

    return {
      destroy() {
        contentObserver.disconnect();
      }
    };
  }

  onDestroy(() => {
    headingObserver?.disconnect();
  });
</script>

<svelte:head>
  <title>{data.post.title} - Zerokaze Blog</title>
  <meta name="description" content={data.post.description} />
</svelte:head>

<div class="post-shell">
  <article class="post-article">
    <header class="post-header">
      <div class="post-breadcrumb">
        <a href="/blog" class="breadcrumb-link"><Icons name="arrow-left" size={16} /> 返回所有文章</a>
      </div>
      <h1 class="post-title">{data.post.title}</h1>
      <div class="post-meta-bar">
        <time class="post-date">
          <Icons name="calendar" size={15} />
          {new Date(data.post.date).toLocaleDateString('zh-CN', {
            year: 'numeric', month: 'long', day: 'numeric'
          })}
        </time>
        <span class="meta-sep">·</span>
        <span class="post-author"><Icons name="user" size={15} /> {data.post.author}</span>
        {#if data.post.tags?.length}
          <span class="meta-sep">·</span>
          <div class="post-tags">
            {#each data.post.tags as tag}
              <a href="/tags/{tag}" class="post-tag">#{tag}</a>
            {/each}
          </div>
        {/if}
      </div>
    </header>

    <div class="post-content" use:highlight use:tableOfContents bind:this={postContentEl}>
      {#key data.post.slug}
        {#await postContentPromise}
          <div class="state-box"><div class="spinner"></div><p>加载中...</p></div>
        {:then module}
          {@const Content = module.default}
          <Content />
        {:catch error}
          <div class="state-box error"><p>⚠️ 加载失败: {error.message}</p></div>
        {/await}
      {/key}
    </div>

    <footer class="post-footer">
      <hr class="footer-divider" />
      <div class="footer-nav">
        <a href="/blog" class="footer-back"><Icons name="arrow-left" size={16} /> 返回所有文章</a>
      </div>
    </footer>
  </article>

  {#if tocItems.length > 0}
    <aside class="post-toc" aria-label="文章目录">
      <div class="toc-title">目录</div>
      <nav>
        {#each tocItems as item}
          <a
            class:active={item.id === activeHeadingId}
            class:toc-level-3={item.level === 3}
            href={`#${item.id}`}
          >
            {item.text}
          </a>
        {/each}
      </nav>
    </aside>
  {/if}
</div>

<style>
  .post-shell {
    display: grid;
    grid-template-columns: minmax(0, 920px) 240px;
    gap: clamp(2.5rem, 4vw, 4rem);
    align-items: start;
    max-width: 1240px;
    margin: 0 auto;
    padding: clamp(1.5rem, 3vw, 3rem) clamp(1.25rem, 4vw, 3rem) 0;
  }

  .post-article {
    width: 100%;
    min-width: 0;
    padding: 0 0 3rem;
  }

  .post-header {
    margin-bottom: clamp(3rem, 5vw, 4.5rem);
    text-align: center;
  }

  .post-breadcrumb {
    text-align: left;
    margin-bottom: 1.8rem;
  }

  .breadcrumb-link {
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
    color: var(--color-accent);
    text-decoration: none;
    font-size: 0.95rem;
    transition: color 0.2s;
  }

  .breadcrumb-link:hover {
    color: var(--color-accent-light);
  }

  .post-title {
    max-width: 980px;
    margin: 0 auto 1.4rem;
    font-size: clamp(2rem, 3.6vw, 3.1rem);
    font-weight: 800;
    color: var(--color-text-primary);
    line-height: 1.16;
  }

  .post-meta-bar {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.55rem 0.8rem;
    flex-wrap: wrap;
    color: var(--color-text-muted);
    font-size: 0.96rem;
  }

  .post-date,
  .post-author {
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
  }

  .meta-sep {
    color: var(--color-text-dim);
  }

  .post-tags {
    display: flex;
    gap: 0.4rem;
    flex-wrap: wrap;
  }

  .post-tag {
    color: var(--color-accent-light);
    text-decoration: none;
    font-size: 0.85rem;
    transition: color 0.2s;
  }

  .post-tag:hover {
    color: var(--color-accent);
  }

  .post-content {
    background: var(--color-bg-primary);
  }

  .post-toc {
    position: sticky;
    top: 5rem;
    max-height: calc(100vh - 6rem);
    overflow-y: auto;
    padding: 1.6rem 0 1.6rem 1.5rem;
    border-left: 1px solid var(--color-border);
  }

  .toc-title {
    margin-bottom: 0.7rem;
    color: var(--color-text-primary);
    font-size: 0.82rem;
    font-weight: 700;
  }

  .post-toc nav {
    display: flex;
    flex-direction: column;
    gap: 0.2rem;
  }

  .post-toc a {
    display: block;
    padding: 0.28rem 0;
    color: var(--color-text-muted);
    font-size: 0.86rem;
    line-height: 1.5;
    text-decoration: none;
    transition: color 0.2s ease;
  }

  .post-toc a:hover,
  .post-toc a.active {
    color: var(--color-accent-light);
  }

  .post-toc a.active {
    font-weight: 650;
  }

  .post-toc a.toc-level-3 {
    padding-left: 0.9rem;
    font-size: 0.82rem;
  }

  .state-box {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 200px;
    color: var(--color-text-muted);
  }

  .state-box.error p {
    color: #f87171;
  }

  .spinner {
    width: 36px;
    height: 36px;
    border: 3px solid rgba(255, 255, 255, 0.05);
    border-top-color: var(--color-accent);
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
    margin-bottom: 0.75rem;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  .post-footer {
    margin-top: 2rem;
  }

  .footer-divider {
    border: none;
    border-top: 1px solid var(--color-border);
    margin-bottom: 1.5rem;
  }

  .footer-nav {
    text-align: center;
  }

  .footer-back {
    display: inline-block;
    padding: 0.6rem 1.5rem;
    background: rgba(96, 165, 250, 0.1);
    border: 1px solid rgba(96, 165, 250, 0.2);
    border-radius: 10px;
    color: var(--color-accent-light);
    text-decoration: none;
    font-size: 0.9rem;
    transition: all 0.2s;
  }

  .footer-back:hover {
    background: rgba(96, 165, 250, 0.2);
  }

  @media (max-width: 1180px) {
    .post-shell {
      display: block;
      max-width: 860px;
      padding-inline: clamp(1rem, 5vw, 2.5rem);
    }

    .post-toc {
      display: none;
    }
  }

  @media (max-width: 640px) {
    .post-shell {
      padding-top: 1.2rem;
      padding-inline: 1rem;
    }

    .post-header {
      margin-bottom: 2rem;
      text-align: left;
    }

    .post-breadcrumb {
      margin-bottom: 1.3rem;
    }

    .post-title {
      font-size: 1.75rem;
      margin-inline: 0;
    }

    .post-meta-bar {
      justify-content: flex-start;
      font-size: 0.9rem;
    }
  }
</style>
