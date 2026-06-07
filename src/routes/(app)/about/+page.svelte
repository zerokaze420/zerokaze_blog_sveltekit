<script lang="ts">
  import { base } from '$app/paths';
  import RandomImage from "$lib/components/RandomImage.svelte";
</script>

<svelte:head>
  <title>关于我 - Zerokaze Blog</title>
  <meta name="description" content="关于 Zerokaze 的个人介绍" />
</svelte:head>

<div class="about-page">
  <div class="about-card">
    <div class="about-header">
      <div class="avatar-ring">
        <div class="avatar-placeholder">ZK</div>
      </div>
      <h1 class="about-name">Zerokaze</h1>
      <p class="about-role">运维开发 & 系统测试</p>
      <div class="about-links">
        <a href="https://github.com/zerokaze420" target="_blank" rel="noopener" class="about-link">
          <svg class="link-icon" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
          </svg>
          GitHub
        </a>
        <a href="mailto:erfu81856@gmail.com" class="about-link">
          <svg class="link-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
          </svg>
          Email
        </a>
      </div>
    </div>

    <div class="about-body">
      <section class="about-section">
        <h2 class="section-title">👋 关于我</h2>
        <p class="section-text">
          一位充满热情的开发者，6年 Linux 日常使用经验，精通 Arch Linux、Gentoo、NixOS 等发行版下的开发、编程与测试脚本。
          熟练编写 Shell 脚本、Python 脚本。熟悉 Vue、Next.js、Svelte 等前端框架基础，对 Linux 以及操作系统有强烈兴趣。
        </p>
      </section>

      <section class="about-section">
        <h2 class="section-title">💼 经历</h2>
        <div class="timeline-mini">
          <div class="tl-item">
            <div class="tl-dot"></div>
            <div class="tl-content">
              <h3>RISC-V 系统测试实习生</h3>
              <p class="tl-org">中科院软件所 · RevyOS 小队</p>
              <p class="tl-period">2025.08 - 至今</p>
            </div>
          </div>
          <div class="tl-item">
            <div class="tl-dot"></div>
            <div class="tl-content">
              <h3>运维+开发</h3>
              <p class="tl-org">字节筑梦</p>
              <p class="tl-period">2025.06 - 至今</p>
            </div>
          </div>
        </div>
      </section>

      <section class="about-section">
        <h2 class="section-title">🛠️ 技术栈</h2>
        <div class="skill-grid">
          <div class="skill-cat">
            <h3>工具与平台</h3>
            <div class="skill-tags">
              <span class="skill-tag">Git</span>
              <span class="skill-tag">Linux</span>
              <span class="skill-tag">Docker</span>
              <span class="skill-tag">Podman</span>
              <span class="skill-tag">Nix</span>
              <span class="skill-tag">GitHub Actions</span>
            </div>
          </div>
          <div class="skill-cat">
            <h3>编程语言</h3>
            <div class="skill-tags">
              <span class="skill-tag">Go</span>
              <span class="skill-tag">Python</span>
              <span class="skill-tag">Shell</span>
              <span class="skill-tag">C++</span>
              <span class="skill-tag">Rust</span>
            </div>
          </div>
          <div class="skill-cat">
            <h3>前端技术</h3>
            <div class="skill-tags">
              <span class="skill-tag">Svelte</span>
              <span class="skill-tag">TypeScript</span>
              <span class="skill-tag">React</span>
              <span class="skill-tag">Vue</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>

  <div class="random-image-section">
    <RandomImage />
  </div>
</div>

<style>
  .about-page {
    max-width: 800px;
    margin: 0 auto;
    padding: 1rem 0;
  }

  .about-card {
    background: rgba(30, 41, 59, 0.5);
    backdrop-filter: blur(16px);
    border: 1px solid rgba(255, 255, 255, 0.06);
    border-radius: 20px;
    overflow: hidden;
  }

  .about-header {
    text-align: center;
    padding: 2.5rem 2rem 2rem;
    background: linear-gradient(180deg, rgba(96, 165, 250, 0.08), transparent);
    border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  }

  .avatar-ring {
    width: 80px;
    height: 80px;
    margin: 0 auto 1rem;
    border-radius: 50%;
    background: linear-gradient(135deg, #60a5fa, #a78bfa);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 3px;
  }

  .avatar-placeholder {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background: #1e293b;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5rem;
    font-weight: 700;
    color: #60a5fa;
  }

  .about-name {
    font-size: 1.8rem;
    font-weight: 700;
    color: #f1f5f9;
    margin-bottom: 0.3rem;
  }

  .about-role {
    color: #94a3b8;
    font-size: 1rem;
    margin-bottom: 1rem;
  }

  .about-links {
    display: flex;
    justify-content: center;
    gap: 1rem;
  }

  .about-link {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    padding: 0.4rem 1rem;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 8px;
    color: #94a3b8;
    text-decoration: none;
    font-size: 0.85rem;
    transition: all 0.2s;
  }

  .about-link:hover {
    background: rgba(255, 255, 255, 0.1);
    color: #e2e8f0;
  }

  .link-icon {
    width: 18px;
    height: 18px;
  }

  .about-body {
    padding: 2rem;
  }

  .about-section {
    margin-bottom: 1.5rem;
  }

  .section-title {
    font-size: 1.2rem;
    font-weight: 600;
    color: #f1f5f9;
    margin-bottom: 0.75rem;
  }

  .section-text {
    color: #94a3b8;
    line-height: 1.7;
    font-size: 0.95rem;
  }

  /* Mini timeline */
  .timeline-mini {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .tl-item {
    display: flex;
    gap: 0.75rem;
    align-items: flex-start;
  }

  .tl-dot {
    width: 10px;
    height: 10px;
    min-width: 10px;
    border-radius: 50%;
    background: #60a5fa;
    margin-top: 6px;
    box-shadow: 0 0 8px rgba(96, 165, 250, 0.4);
  }

  .tl-content h3 {
    font-size: 0.95rem;
    font-weight: 600;
    color: #e2e8f0;
  }

  .tl-org {
    font-size: 0.85rem;
    color: #60a5fa;
  }

  .tl-period {
    font-size: 0.8rem;
    color: #64748b;
  }

  /* Skills */
  .skill-grid {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .skill-cat h3 {
    font-size: 0.85rem;
    color: #94a3b8;
    margin-bottom: 0.4rem;
    font-weight: 500;
  }

  .skill-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.4rem;
  }

  .skill-tag {
    padding: 0.25rem 0.65rem;
    background: rgba(96, 165, 250, 0.08);
    border: 1px solid rgba(96, 165, 250, 0.12);
    border-radius: 6px;
    font-size: 0.82rem;
    color: #93c5fd;
  }

  .random-image-section {
    margin-top: 2rem;
  }
</style>
