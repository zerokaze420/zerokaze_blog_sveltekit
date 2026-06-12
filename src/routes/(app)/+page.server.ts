import type { PageServerLoad } from './$types';

interface PostEntry {
  slug: string;
  title: string;
  date: string;
  description: string;
  tags: string[];
}

export const load: PageServerLoad = async () => {
  const modules = import.meta.glob('/src/lib/posts/*.md', { eager: true }) as Record<string, any>;
  const allPosts: PostEntry[] = Object.entries(modules).map(([path, module]) => {
    const slug = path.split('/').pop()?.slice(0, -3) ?? '';
    const meta = module.metadata ?? {};

    return {
      slug,
      title: meta.title ?? '',
      date: meta.publishDate || meta.date || '',
      description: meta.description ?? '',
      tags: meta.tags ?? []
    };
  });

  allPosts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const tagCounts: Record<string, number> = {};
  for (const post of allPosts) {
    for (const tag of post.tags) {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1;
    }
  }

  return {
    recentPosts: allPosts.slice(0, 5),
    tagCounts,
    totalPosts: allPosts.length
  };
};
