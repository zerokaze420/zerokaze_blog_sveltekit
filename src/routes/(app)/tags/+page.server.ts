import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
    // 1. 使用 import.meta.glob 寻找所有 Markdown 档案
    //    { eager: true } 表示立即载入所有模组，而不是回传一个动态 import 函数
    const postsModules = import.meta.glob('/src/lib/posts/*.md', { eager: true });

    // 2. 处理所有找到的模组
    const posts = Object.entries(postsModules).map(([path, module]) => {
        // 从档案路径中提取 slug
        // 例如：'/src/lib/posts/my-first-post.md' -> 'my-first-post'
        const slug = path.split('/').pop()?.slice(0, -3);

        // 假设模组的型别是已知的 (包含 metadata)
        const typedModule = module as { metadata: Record<string, any> };

        return {
            slug: slug,
            metadata: typedModule.metadata
        };
    });

    // 3. (推荐) 按日期对文章进行排序，最新的在前面
    posts.sort((a, b) => 
        new Date(b.metadata.date).getTime() - new Date(a.metadata.date).getTime()
    );

    // 4. 回传文章列表
    return {
        posts: posts
    };
};