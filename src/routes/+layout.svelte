<script lang="ts">
    import '../app.css';
    // 为了避免混淆，最好将 Sidebar 组件重命名为 Header 或 Navbar
    import Header from '$lib/components/Sidebar/Header.svelte';
    import { QueryClientProvider, QueryClient } from '@tanstack/svelte-query';

    const queryClient = new QueryClient();

    let { children } = $props();
</script>

<QueryClientProvider client={queryClient}>
<div class="  min-h-screen">
  <main class=" w-full p-8 flex-col">
       <Header class="w-full h-16 bg-white shadow-md" /> 

    {@render children()}
  </main>
  </div>
 </QueryClientProvider>

  

