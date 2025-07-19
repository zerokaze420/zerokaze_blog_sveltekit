<script lang="ts">
  // 导入 `base` 变量，它会根据环境自动变化
  import { base } from '$app/paths';
</script>

<aside class="w-64 bg-gray-800 text-white p-4 space-y-4">
  <div class="text-2xl font-bold mb-6">博客导航</div>
  <nav>
    <ul>
      <li>
        <a href="{base}/" class="block py-2 px-3 rounded hover:bg-gray-700 transition duration-200">首页</a>
      </li>
      <li>
        <a href="{base}/blog" class="block py-2 px-3 rounded hover:bg-gray-700 transition duration-200">所有文章</a>
      </li>
      <li>
        <a href="{base}/tags" class="block py-2 px-3 rounded hover:bg-gray-700 transition duration-200">标签</a>
      </li>
      <li>
        <a href="{base}/about" class="block py-2 px-3 rounded hover:bg-gray-700 transition duration-200">关于我</a>
      </li>
    </ul>
  </nav>
</aside>

<style>
  /* 你也可以在这里编写组件特有的 CSS，但我们目前主要使用 Tailwind CSS */
</style>