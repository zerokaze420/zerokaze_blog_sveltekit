<script>
  import '../app.css';
  import { onNavigate } from '$app/navigation';
  import Footer from '$lib/components/Footer.svelte';
  import { fly } from 'svelte/transition';

  let { children } = $props();

  let navigating = $state(false);

  onNavigate(() => {
    // View Transitions API —— 原生页面过渡动画
    if (document.startViewTransition) {
      return new Promise((resolve) => {
        document.startViewTransition(async () => {
          resolve();
        });
      });
    }
  });
</script>

<div class="app-shell">
  <main class="main-content">
    {#key Date.now()}
      <div
        class="page-wrapper"
        transition:fly={{ y: 20, duration: 300, opacity: 0 }}
      >
        {@render children()}
      </div>
    {/key}
  </main>
  <Footer />
</div>

<style>
  .app-shell {
    display: flex;
    min-height: 100vh;
    flex-direction: column;
  }

  .main-content {
    flex: 1;
  }

  .page-wrapper {
    animation: page-enter 0.35s ease-out both;
  }

  @keyframes page-enter {
    from {
      opacity: 0;
      transform: translateY(12px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  /* View Transitions API */
  @view-transition {
    navigation: auto;
  }

  ::view-transition-old(root) {
    animation: 0.2s ease-out both fade-out;
  }

  ::view-transition-new(root) {
    animation: 0.3s ease-out 0.1s both fade-in;
  }

  @keyframes fade-out {
    to { opacity: 0; }
  }

  @keyframes fade-in {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
</style>
