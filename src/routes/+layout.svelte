<script lang="ts">
    import '../app.css'; // 确保你的 Tailwind CSS 已经引入
    import Sidebar from '$lib/components/Sidebar.svelte';
    // import Footer from '$lib/components/Footer.svelte'; // 导入 Footer 组件

    let { children } = $props();
</script>

<div class="flex">
  <Sidebar />
  <main class="flex-1 p-8">
    {@render children()}
  </main>
</div>
