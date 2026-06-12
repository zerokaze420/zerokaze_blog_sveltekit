<script lang="ts">
  const currentYear = new Date().getFullYear();
</script>

<footer class="footer">
  <div class="footer-content">
    <div class="footer-brand">
      <span class="footer-logo">Zerokaze Blog</span>
      <p class="footer-desc">给系统、工具与界面留下可检索的手稿。</p>
    </div>
    <div class="footer-links">
      <div class="footer-section">
        <h3 class="footer-heading">导航</h3>
        <a href="/" class="footer-link">首页</a>
        <a href="/blog" class="footer-link">所有文章</a>
        <a href="/tags" class="footer-link">标签</a>
        <a href="/about" class="footer-link">档案</a>
      </div>
      <div class="footer-section">
        <h3 class="footer-heading">技术栈</h3>
        <span class="footer-tech">SvelteKit</span>
        <span class="footer-tech">Tailwind CSS</span>
        <span class="footer-tech">mdsvex</span>
        <span class="footer-tech">Bun</span>
      </div>
    </div>
  </div>
  <div class="footer-bottom">
    <p>© {currentYear} Zerokaze. Built with SvelteKit</p>
  </div>
</footer>

<style>
  .footer {
    margin-top: auto;
    background: var(--color-bg-footer);
    border-top: 1px solid var(--color-border);
    padding: 2.5rem 2rem 1.5rem;
    color: var(--color-text-muted);
  }

  .footer-content {
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    gap: 3rem;
    flex-wrap: wrap;
  }

  .footer-brand {
    flex: 1;
    min-width: 200px;
  }

  .footer-logo {
    font-size: 1rem;
    font-weight: 700;
    color: var(--color-text-primary);
  }

  .footer-desc {
    margin-top: 0.5rem;
    font-size: 0.9rem;
    color: var(--color-text-muted);
  }

  .footer-links {
    display: flex;
    gap: 3rem;
    flex-wrap: wrap;
  }

  .footer-section {
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
  }

  .footer-heading {
    font-size: 0.85rem;
    font-weight: 600;
    color: var(--color-text-primary);
    margin-bottom: 0.3rem;
    text-transform: uppercase;
    letter-spacing: 0;
  }

  .footer-link {
    color: var(--color-text-muted);
    text-decoration: none;
    font-size: 0.9rem;
    transition: color 0.2s;
  }

  .footer-link:hover {
    color: var(--color-text-primary);
  }

  .footer-tech {
    color: var(--color-text-subtle);
    font-size: 0.85rem;
  }

  .footer-bottom {
    max-width: 1200px;
    margin: 2rem auto 0;
    padding-top: 1rem;
    border-top: 1px solid var(--color-border);
    text-align: center;
    font-size: 0.85rem;
    color: var(--color-text-subtle);
  }
</style>
