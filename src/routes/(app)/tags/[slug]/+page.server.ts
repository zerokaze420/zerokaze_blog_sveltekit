// src/routes/(app)/tags/[slug]/+page.server.js

import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { PostMetadata } from '$lib/types';

/**
 * 这是一个 SvelteKit 的“条目”函数，用于在构建时（build time）
 * 告诉预渲染器（prerenderer）所有需要生成的动态路径。
 * * @returns {Promise<Array<{ slug: string }>>} 返回一个包含所有文章 slug 的数组。
 */
export async function entries() {
  // 使用 Vite 的 glob 导入功能来获取所有 Markdown 文件
  const modules = import.meta.glob('../../../../lib/posts/*.md');

  // 从文件路径中提取 slug
  const slugs = Object.keys(modules).map(path => {
    // 路径格式类似于 '../../../../lib/posts/my-post.md'
    // 我们只需要 'my-post'
    return path.split('/').pop().replace('.md', '');
  });

  // 将 slug 数组转换成 SvelteKit 需要的格式：[{ slug: 'my-post' }, { slug: 'another-post' }]
  return slugs.map(slug => ({ slug }));
}

/**
 * 这会告诉 SvelteKit，此路由是可以预渲染的。
 * @type {boolean}
 */
export const prerender = true;


/**
 * 这是一个 SvelteKit 的“加载”函数，用于在运行时（run time）
 * 根据 URL 参数加载特定文章的数据。
 * * @type {PageServerLoad}
 */
export const load: PageServerLoad = async ({ params }) => {
  try {
    // 根据 URL 中的 slug 参数动态导入对应的 Markdown 文件
    const postModule = await import(`../../../../lib/posts/${params.slug}.md`);
    
    // 从 frontmatter 获取原始元数据
    const metadata: PostMetadata = postModule.metadata;

    // 确保返回的对象中包含 slug，以保证和 URL 一致
    const finalMetadata = {
      ...metadata,
      slug: params.slug 
    };

    return {
      metadata: finalMetadata
    };
  } catch (e) {
    // 如果文件加载失败，抛出 404 错误
    throw error(404, '文章未找到');
  }
};