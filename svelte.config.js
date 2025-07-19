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
        }
    },
    compilerOptions: {
		runes: true
	}
};

export default config;
