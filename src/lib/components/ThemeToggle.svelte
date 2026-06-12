<script lang="ts">
  import { onMount } from 'svelte';
  import darkTheme from 'highlight.js/styles/atom-one-dark.css?raw';
  import lightTheme from 'highlight.js/styles/atom-one-light.css?raw';

  let theme = $state<'dark' | 'light'>('dark');

  function injectCodeTheme(css: string) {
    const id = 'hljs-theme';
    const existing = document.getElementById(id);
    if (existing) existing.remove();
    const style = document.createElement('style');
    style.id = id;
    style.textContent = css;
    document.head.appendChild(style);
  }

  function applyTheme(t: 'dark' | 'light') {
    document.documentElement.setAttribute('data-theme', t);
    localStorage.setItem('blog-theme', t);
    injectCodeTheme(t === 'dark' ? darkTheme : lightTheme);
  }

  onMount(() => {
    const saved = localStorage.getItem('blog-theme');
    if (saved === 'light' || saved === 'dark') {
      theme = saved;
    } else {
      theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    applyTheme(theme);
  });

  function toggle() {
    theme = theme === 'dark' ? 'light' : 'dark';
    applyTheme(theme);
  }
</script>

<button
  class="theme-toggle"
  onclick={toggle}
  aria-label="切换主题"
  title={theme === 'dark' ? '切换到亮色模式' : '切换到暗色模式'}
>
  {#if theme === 'dark'}
    <svg xmlns="http://www.w3.org/2000/svg" class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
    </svg>
  {:else}
    <svg xmlns="http://www.w3.org/2000/svg" class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <circle cx="12" cy="12" r="5"/>
      <line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
      <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
    </svg>
  {/if}
</button>

<style>
  .theme-toggle {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    padding: 0.4rem;
    border-radius: 8px;
    color: var(--color-text-muted);
    background: transparent;
    border: 1px solid var(--color-border);
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .theme-toggle:hover {
    color: var(--color-text-primary);
    border-color: var(--color-border-hover);
    background: var(--color-bg-secondary);
  }

  .icon {
    width: 18px;
    height: 18px;
    transition: transform 0.2s ease;
  }
</style>
