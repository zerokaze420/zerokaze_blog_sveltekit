// 导入正确的静态适配器
import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { mdsvex } from 'mdsvex';

/** @type {import('@sveltejs/kit').Config} */
const config = {
    extensions: ['.svelte', '.md'],
    preprocess: [
        mdsvex({
            extensions: ['.md'],
        }),
        vitePreprocess(),
    ],

    kit: {
        adapter: adapter({
            pages: 'build',
            assets: 'build',
            fallback: undefined,
            precompress: false,
            strict: true
        }),

        paths: {
            base: process.env.NODE_ENV === 'production' ? '/zerokaze_blog_sveltekit' : ''
        },
        prerender: {
            handleHttpError: ({ status, path, referrer, message }) => {
                if (status === 404) {
                    console.warn(`忽略预渲染 ${path} 时的 404 错误`);
                    return;
                }
                throw new Error(message);
            }
        }
    },
};

export default config;
