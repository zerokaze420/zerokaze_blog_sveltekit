// src/routes/(app)/tags/[slug]/+page.server.ts

import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { PostMetadata } from '$lib/types';

/**
 * @type {import('./$types').PrerenderLoad}
 */
export async function entries() {
  const modules = import.meta.glob('../../../../lib/posts/*.md');
  
  const slugs = Object.keys(modules).map(path => {
    // 使用可选链 ?. 和空值合并 ?? '' 来安全地处理可能为 undefined 的情况
    // pop() 返回最后一个元素或 undefined
    // 如果返回 undefined，则使用一个空字符串 '' 作为备用
    const fileName = path.split('/').pop() ?? ''; 
    return fileName.replace('.md', '');
  });
  
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
 * @type {PageServerLoad}
 */
export const load: PageServerLoad = async ({ params }) => {
  try {
    const postModule = await import(`../../../../lib/posts/${params.slug}.md`);
    const metadata: PostMetadata = postModule.metadata;

    const finalMetadata = {
      ...metadata,
      slug: params.slug 
    };

    return {
      metadata: finalMetadata
    };
  } catch (e) {
    throw error(404, '文章未找到');
  }
};