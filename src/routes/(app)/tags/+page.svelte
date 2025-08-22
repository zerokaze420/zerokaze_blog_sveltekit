<script lang="ts">
    import type { PageData } from './$types';
    import { base } from '$app/paths';
    export let data: PageData;
</script>

<div class="min-h-screen columns-1 gap-4 p-4 md:columns-2 lg:columns-3">
    {#each data.posts as post}
        <a 
            href="{base}/blog/{post.slug}" 
            class="block break-inside-avoid mb-4 p-5 rounded-xl 
                   bg-black/30 backdrop-blur-lg border border-white/20 
                   text-gray-200 shadow-lg transition-all hover:bg-black/50 hover:border-white/30"
        >
            <p class="text-xl font-semibold">{post.metadata.title}</p>
            <p class="mt-2 text-gray-300">{post.metadata.description}</p>
        </a>
    {/each}
</div>

<style>
 

</style>