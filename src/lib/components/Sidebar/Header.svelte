<script lang="ts">
  import { base } from '$app/paths';
  import { onMount } from 'svelte';

  let { class: className = '' } = $props();

  let isNavOpen = $state(false);
  let isVisible = $state(true);
  let lastScrollY = 0;
  let isScrolled = $state(false);

  function toggleNav() {
    isNavOpen = !isNavOpen;
  }

  onMount(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      isScrolled = currentScrollY > 20;

      if (currentScrollY > lastScrollY && currentScrollY > 80) {
        isVisible = false;
      } else if (currentScrollY < lastScrollY) {
        isVisible = true;
      }

      lastScrollY = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  });
</script>

<header
  class="header"
  class:header-hidden={!isVisible}
  class:header-scrolled={isScrolled}
>
  <div class="header-inner">
    <!-- Logo -->
    <a href={`${base}/`} class="logo">
      <span class="logo-icon">✦</span>
      <span class="logo-text">Zerokaze</span>
    </a>

    <!-- Desktop Nav -->
    <nav class="nav-desktop">
      <a href={`${base}/`} class="nav-link">首页</a>
      <a href={`${base}/blog`} class="nav-link">所有文章</a>
      <a href={`${base}/tags`} class="nav-link">标签</a>
      <a href={`${base}/calendar`} class="nav-link">时间线</a>
      <a href={`${base}/about`} class="nav-link nav-link-about">关于我</a>
    </nav>

    <!-- Hamburger -->
    <button
      class="hamburger"
      onclick={toggleNav}
      aria-expanded={isNavOpen}
      aria-label="Toggle navigation"
    >
      {#if isNavOpen}
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      {:else}
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      {/if}
    </button>
  </div>

  <!-- Mobile Nav -->
  {#if isNavOpen}
    <nav class="nav-mobile">
      <a href={`${base}/`} class="nav-link-mobile" onclick={toggleNav}>首页</a>
      <a href={`${base}/blog`} class="nav-link-mobile" onclick={toggleNav}>所有文章</a>
      <a href={`${base}/tags`} class="nav-link-mobile" onclick={toggleNav}>标签</a>
      <a href={`${base}/calendar`} class="nav-link-mobile" onclick={toggleNav}>时间线</a>
      <a href={`${base}/about`} class="nav-link-mobile" onclick={toggleNav}>关于我</a>
    </nav>
  {/if}
</header>

<style>
  .header {
    position: sticky;
    top: 0;
    z-index: 50;
    width: 100%;
    background: rgba(11, 17, 32, 0.75);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border-bottom: 1px solid rgba(255, 255, 255, 0.06);
    transition: transform 0.3s ease, background 0.3s ease, box-shadow 0.3s ease;
  }

  .header-scrolled {
    background: rgba(11, 17, 32, 0.92);
    box-shadow: 0 4px 30px rgba(0, 0, 0, 0.3);
  }

  .header-hidden {
    transform: translateY(-100%);
  }

  .header-inner {
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 1.5rem;
    height: 64px;
  }

  .logo {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    text-decoration: none;
  }

  .logo-icon {
    font-size: 1.5rem;
  }

  .logo-text {
    font-size: 1.25rem;
    font-weight: 700;
    background: linear-gradient(135deg, #60a5fa, #a78bfa);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .nav-desktop {
    display: none;
    align-items: center;
    gap: 0.25rem;
  }

  @media (min-width: 768px) {
    .nav-desktop {
      display: flex;
    }
  }

  .nav-link {
    padding: 0.5rem 0.9rem;
    border-radius: 8px;
    font-size: 0.9rem;
    font-weight: 500;
    color: #94a3b8;
    text-decoration: none;
    transition: all 0.2s ease;
    position: relative;
  }

  .nav-link:hover {
    color: #e2e8f0;
    background: rgba(255, 255, 255, 0.05);
  }

  .nav-link-about {
    background: linear-gradient(135deg, rgba(96, 165, 250, 0.12), rgba(167, 139, 250, 0.12));
    border: 1px solid rgba(96, 165, 250, 0.15);
    color: #93c5fd;
    margin-left: 0.5rem;
  }

  .nav-link-about:hover {
    background: linear-gradient(135deg, rgba(96, 165, 250, 0.2), rgba(167, 139, 250, 0.2));
    border-color: rgba(96, 165, 250, 0.3);
  }

  .hamburger {
    display: block;
    padding: 0.5rem;
    border-radius: 8px;
    color: #94a3b8;
    background: none;
    border: none;
    cursor: pointer;
    transition: color 0.2s;
  }

  .hamburger:hover {
    color: #e2e8f0;
  }

  @media (min-width: 768px) {
    .hamburger {
      display: none;
    }
  }

  .nav-mobile {
    border-top: 1px solid rgba(255, 255, 255, 0.06);
    padding: 0.5rem;
    animation: slideDown 0.2s ease-out;
  }

  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateY(-8px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .nav-link-mobile {
    display: block;
    padding: 0.75rem 1rem;
    border-radius: 8px;
    font-size: 1rem;
    color: #94a3b8;
    text-decoration: none;
    transition: all 0.2s;
  }

  .nav-link-mobile:hover {
    color: #e2e8f0;
    background: rgba(255, 255, 255, 0.05);
  }
</style>
