// src/routes/(app)/tags/[slug]/+page.server.ts

import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { PostMetadata } from '$lib/types';

/**
 * 预渲染入口：同时支持文章 slug 和标签名
 */
export async function entries() {
  const modules = import.meta.glob('../../../../lib/posts/*.md', { eager: true }) as Record<string, any>;

  const slugs = new Set<string>();

  for (const [path, module] of Object.entries(modules)) {
    const fileName = path.split('/').pop() ?? '';
    const slug = fileName.replace('.md', '');

    // 文章 slug
    slugs.add(slug);

    // 标签名也作为可能的 slug
    const meta = (module as { metadata: Record<string, any> }).metadata;
    if (meta.tags && Array.isArray(meta.tags)) {
      for (const tag of meta.tags) {
        slugs.add(tag);
      }
    }
  }

  return Array.from(slugs).map(slug => ({ slug }));
}

export const prerender = true;

/**
 * 加载函数：根据 slug 加载文章或按标签过滤文章列表
 */
export const load: PageServerLoad = async ({ params }) => {
  const slug = params.slug;

  // 方案一：先尝试作为文章 slug 加载
  try {
    const postModule = await import(`../../../../lib/posts/${slug}.md`);
    const metadata: PostMetadata = postModule.metadata;

    return {
      mode: 'post' as const,
      metadata: {
        ...metadata,
        slug: params.slug
      }
    };
  } catch {
    // 不是文章 slug，继续尝试作为标签名
  }

  // 方案二：作为标签名，过滤出所有包含该标签的文章
  const allModules = import.meta.glob('../../../../lib/posts/*.md', { eager: true }) as Record<string, any>;

  const taggedPosts = Object.entries(allModules)
    .map(([path, module]) => {
      const meta = (module as { metadata: Record<string, any> }).metadata;
      const postSlug = path.split('/').pop()?.slice(0, -3) ?? '';
      return {
        slug: postSlug,
        metadata: meta as Record<string, any>
      };
    })
    .filter((post): post is { slug: string; metadata: Record<string, any> } => {
      const tags: string[] = post.metadata?.tags ?? [];
      return tags.some(t => t.toLowerCase() === slug.toLowerCase());
    })
    .sort((a, b) => {
      const dateA = a.metadata?.publishDate || a.metadata?.date || '';
      const dateB = b.metadata?.publishDate || b.metadata?.date || '';
      return new Date(dateB).getTime() - new Date(dateA).getTime();
    });

  if (taggedPosts.length === 0) {
    throw error(404, '未找到相关文章或标签');
  }

  return {
    mode: 'tag' as const,
    tag: slug,
    posts: taggedPosts
  };
};
