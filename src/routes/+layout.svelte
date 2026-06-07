<script>
  import '../app.css';
  import Footer from '$lib/components/Footer.svelte';

  let { children } = $props();
</script>

<div class="flex min-h-screen flex-col">
  <main class="flex-1">
    {@render children()}
  </main>
  <Footer />
</div>
