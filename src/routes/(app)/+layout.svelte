<script lang="ts">
    import Header from '$lib/components/Sidebar/Header.svelte';
    import { QueryClientProvider, QueryClient } from '@tanstack/svelte-query';

    const queryClient = new QueryClient();

    let { children } = $props();
</script>

<QueryClientProvider client={queryClient}>
  <div class="w-full">
    <Header />
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
      {@render children()}
    </div>
  </div>
</QueryClientProvider>
