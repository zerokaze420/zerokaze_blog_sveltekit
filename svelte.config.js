// 导入正确的静态适配器
import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { mdsvex } from 'mdsvex';

/** @type {import('@sveltejs/kit').Config} */
const config = {
    // 保留你为 Markdown 文件设置的预处理器
    extensions: ['.svelte', '.md'],
    preprocess: [
        mdsvex({
            extensions: ['.md'],
        }),
        vitePreprocess(),
    ],

    kit: {
        // 使用我们导入的 adapter-static
        adapter: adapter({
            // 这里是 adapter-static 的配置，保持不变
            pages: 'build',
            assets: 'build',
            fallback: undefined,
            precompress: false,
            strict: true
        }),

        // 保留你为 GitHub Pages 设置的路径
        paths: {
            base: process.env.NODE_ENV === 'production' ? '/zerokaze_blog_sveltekit' : ''
        },
        prerender: {
            // 告诉 SvelteKit 在预渲染期间如何处理 HTTP 错误
            handleHttpError: ({ status, path, referrer, message }) => {
                // 如果是 404 错误，我们可以在这里选择忽略它
                // 这可能意味着您的根路由在没有实时 API 响应的情况下无法预渲染
                if (status === 404) {
                    console.warn(`忽略预渲染 ${path} 时的 404 错误`);
                    return;
                }

                // 对于任何其他错误，我们仍然希望构建失败
                throw new Error(message);
            }
        }
        
        
    },

};

export default config;
