<script lang="ts">
  // 使用内联 SVG 图标，避免 lucide-svelte 导出限制
</script>

<svelte:head>
  <title>站点档案 - Zerokaze Blog</title>
  <meta name="description" content="Zerokaze Blog 的站点档案与技术栈" />
</svelte:head>

<div class="about-page">
  <div class="profile-card">
    <div class="profile-header">
      <div class="avatar">
        <span class="avatar-text">ZK</span>
      </div>
      <h1 class="profile-name">站点档案</h1>
      <p class="profile-bio">
        雨季手稿 · 系统札记 · 前端实验
      </p>
      <div class="profile-links">
        <a href="https://github.com/zerokaze420" target="_blank" rel="noopener" class="link-btn">
          <svg class="icon-svg" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
          </svg>
          <span>GitHub</span>
        </a>
        <a href="mailto:erfu81856@gmail.com" class="link-btn">
          <svg class="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
          </svg>
          <span>Email</span>
        </a>
      </div>
    </div>

    <div class="profile-body">
      <section class="section">
        <h2 class="section-title">档案说明</h2>
        <p class="section-text">
          这里收纳 Linux、Nix、前端框架与工程工具的技术手稿。每一条笔记都尽量保留问题发生的现场，
          让配置、命令、构建和界面在多年之后仍能被重新追溯。
        </p>
      </section>

      <section class="section">
        <h2 class="section-title">站点结构</h2>
        <p class="section-text">
          站点使用 SvelteKit、Tailwind CSS、mdsvex 与 Bun 构建。文章以 Markdown 保存，
          通过标签、时间线和搜索形成一座可游走的索引。
        </p>
        <div class="stack-tags">
          <span class="stack-tag">SvelteKit</span>
          <span class="stack-tag">Tailwind CSS</span>
          <span class="stack-tag">TypeScript</span>
          <span class="stack-tag">mdsvex</span>
          <span class="stack-tag">Bun</span>
          <span class="stack-tag">Nix</span>
        </div>
      </section>

      <section class="section">
        <h2 class="section-title">技术索引</h2>
        <div class="skills">
          <div class="skill-group">
            <h3 class="skill-group-title">工具与平台</h3>
            <div class="skill-items">
              {#each ['Git', 'Linux', 'Docker', 'Podman', 'Nix', 'GitHub Actions'] as skill}
                <span class="skill-item">{skill}</span>
              {/each}
            </div>
          </div>
          <div class="skill-group">
            <h3 class="skill-group-title">语言</h3>
            <div class="skill-items">
              {#each ['Go', 'Python', 'Shell', 'C++', 'Rust'] as skill}
                <span class="skill-item">{skill}</span>
              {/each}
            </div>
          </div>
          <div class="skill-group">
            <h3 class="skill-group-title">前端</h3>
            <div class="skill-items">
              {#each ['Svelte', 'TypeScript', 'React', 'Vue'] as skill}
                <span class="skill-item">{skill}</span>
              {/each}
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</div>

<style>
  .about-page {
    max-width: 720px;
    margin: 0 auto;
    padding: 2rem 1rem 3rem;
  }

  .profile-card {
    background: var(--color-bg-card);
    border: 1px solid var(--color-border);
    border-radius: 8px;
    overflow: hidden;
    box-shadow: var(--shadow-card);
  }

  .profile-header {
    text-align: center;
    padding: 3rem 2rem 2rem;
    background: var(--color-bg-card);
    border-bottom: 1px solid var(--color-border);
  }

  .avatar {
    width: 88px;
    height: 88px;
    margin: 0 auto 1.25rem;
    border-radius: 8px;
    background: var(--color-bg-secondary);
    border: 1px solid var(--color-border);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 3px;
  }

  .avatar-text {
    width: 100%;
    height: 100%;
    border-radius: 6px;
    background: var(--color-bg-primary);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.6rem;
    font-weight: 800;
    color: var(--color-text-primary);
  }

  .profile-name {
    font-size: 2rem;
    font-weight: 800;
    color: var(--color-text-primary);
    margin-bottom: 0.4rem;
  }

  .profile-bio {
    color: var(--color-text-muted);
    font-size: 1rem;
    margin-bottom: 1.5rem;
  }

  .profile-links {
    display: flex;
    justify-content: center;
    gap: 0.75rem;
  }

  .link-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    padding: 0.5rem 1.1rem;
    background: var(--color-bg-card);
    border: 1px solid var(--color-border);
    border-radius: 8px;
    color: var(--color-text-muted);
    text-decoration: none;
    font-size: 0.88rem;
    transition: all 0.2s;
  }

  .link-btn:hover {
    background: var(--color-bg-secondary);
    color: var(--color-text-primary);
    border-color: var(--color-border-hover);
  }

  .icon-svg {
    width: 18px;
    height: 18px;
  }

  .profile-body {
    padding: 2rem;
  }

  .section {
    margin-bottom: 2rem;
  }

  .section:last-child {
    margin-bottom: 0;
  }

  .section-title {
    font-size: 1.1rem;
    font-weight: 700;
    color: var(--color-text-primary);
    padding-bottom: 0.5rem;
    margin-bottom: 0.75rem;
    border-bottom: 1px solid var(--color-border);
  }

  .section-text {
    color: var(--color-text-muted);
    line-height: 1.8;
    font-size: 0.95rem;
    margin-bottom: 0.75rem;
  }

  .stack-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.4rem;
  }

  .stack-tag {
    padding: 0.25rem 0.7rem;
    background: var(--color-bg-secondary);
    border: 1px solid var(--color-border);
    border-radius: 6px;
    font-size: 0.8rem;
    color: var(--color-text-muted);
  }

  .skills {
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
  }

  .skill-group-title {
    font-size: 0.82rem;
    color: var(--color-text-subtle);
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    margin-bottom: 0.5rem;
  }

  .skill-items {
    display: flex;
    flex-wrap: wrap;
    gap: 0.4rem;
  }

  .skill-item {
    padding: 0.3rem 0.75rem;
    background: var(--color-bg-secondary);
    border: 1px solid var(--color-border);
    border-radius: 8px;
    font-size: 0.85rem;
    color: var(--color-text-secondary);
    transition: all 0.2s;
  }

  .skill-item:hover {
    background: var(--color-bg-glass);
    border-color: var(--color-border-hover);
    color: var(--color-text-primary);
  }
</style>
