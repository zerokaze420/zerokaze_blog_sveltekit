import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { PostMetadata } from '$lib/types';

export const load: PageServerLoad = async ({ params }) => {
  try {
    const postModule = await import(`../../../../lib/posts/${params.slug}.md`);
    
    // 从 frontmatter 获取原始元数据
    const metadata: PostMetadata = postModule.metadata;

    // ★ 关键修复：确保返回的对象中一定包含 slug
    // 即使元数据中已有 slug，用 params.slug 覆盖能保证它和 URL 一致
    const finalMetadata = {
      ...metadata,
      slug: params.slug,
      date: metadata.publishDate || metadata.date, // Use publishDate if available, otherwise fallback to date
      author: metadata.author || 'Unknown' // Use author if available, otherwise 'Unknown'
    };

    return {
      post: {
        title: finalMetadata.title,
        date: finalMetadata.date,
        tags: finalMetadata.tags,
        description: finalMetadata.description,
        author: finalMetadata.author,
        slug: finalMetadata.slug, // Pass the slug instead of the component
        rawContent: postModule.rawContent || '' // Assuming rawContent exists, or provide an empty string
      }
    };
  } catch (e) {
    console.error('Error loading post:', e);
    throw error(404, '文章未找到');
  }
};