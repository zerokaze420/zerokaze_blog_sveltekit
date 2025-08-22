// 檔案路徑: src/routes/(app)/blog/[slug]/+page.server.ts

import { error } from '@sveltejs/kit';
import type { PageServerLoad, EntryGenerator } from './$types';
import type { PostMetadata } from '$lib/types';

// ★ 新增 entries 函數，用於在構建時查找所有文章
export const entries: EntryGenerator = () => {
  // 使用 Vite 的 import.meta.glob 功能來獲取所有 markdown 檔案
  // 這會返回一個物件，key 是檔案路徑
  const posts = import.meta.glob('/src/lib/posts/*.md', { eager: true });

  // 從檔案路徑中提取 slug (也就是檔名)
  const slugs = Object.keys(posts).map((path) => {
    // 例如 path: "/src/lib/posts/my-first-post.md"
    // 經過處理後得到 "my-first-post"
    const slug = path.split('/').pop()?.slice(0, -3);
    return { slug: slug! };
  });

  return slugs;
};

// 確保開啟預渲染
export const prerender = true;


// ▼ 您原有的 load 函數保持不變
export const load: PageServerLoad = async ({ params }) => {
  try {
    const postModule = await import(`../../../../lib/posts/${params.slug}.md`);
    const metadata: PostMetadata = postModule.metadata;

    const finalMetadata = {
      ...metadata,
      slug: params.slug 
    };

    return {
      metadata: finalMetadata,
      content: postModule.default // 通常 Markdown 內容會在這裡
    };
  } catch (e) {
    throw error(404, '文章未找到');
  }
};