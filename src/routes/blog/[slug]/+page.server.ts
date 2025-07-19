import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { PostMetadata } from '$lib/types';

export const load: PageServerLoad = async ({ params }) => {
  try {
    const postModule = await import(`../../../lib/posts/${params.slug}.md`);
    
    // 从 frontmatter 获取原始元数据
    const metadata: PostMetadata = postModule.metadata;

    // ★ 关键修复：确保返回的对象中一定包含 slug
    // 即使元数据中已有 slug，用 params.slug 覆盖能保证它和 URL 一致
    const finalMetadata = {
      ...metadata,
      slug: params.slug 
    };

    // 在服务器控制台打印一下，确认数据是否正确

    return {
      metadata: finalMetadata
    };
  } catch (e) {
    throw error(404, '文章未找到');
  }
};