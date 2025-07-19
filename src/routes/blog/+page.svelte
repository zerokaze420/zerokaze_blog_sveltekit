<script lang="ts">
    import type { PageData } from './$types';

    import { base } from '$app/paths';
    export let data: PageData;
</script>

<div class="min-h-screen columns-1 gap-4 md:columns-2 lg:columns-3 bg-gray-100 text-gray-800">
    {#each data.posts as post}
        <div class="w-90/100 break-inside-avoid mb-4 bg-slate-200 rounded-lg p-4">

            <!-- 
              这里是关键的修正！
              我们去掉了 href 属性值外层的模板字符串符号 (` `)。
              Svelte 会自动处理变量和字符串的拼接。
            -->
            <a href="{base}/blog/{post.slug}" class="block break-inside-avoid mb-4 bg-slate-200 rounded-lg p-4 hover:bg-slate-300 transition-colors">
              
                <p class="text-xl font-semibold ">{post.metadata.title}</p>
                <p class="mt-2 text-gray-700">{post.metadata.description}</p>
            </a>
        </div>
    {/each}
</div>
