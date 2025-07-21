<script lang="ts">
  // 导入 SvelteKit 的 base 路径，用于正确生成链接
  import { base } from '$app/paths';

  // 从父组件接收 class 属性，并提供一个默认空字符串
  let { class: className = '' } = $props();

  // 控制移动端导航菜单的显示状态
  let isNavOpen = false;

  // 切换导航菜单显示/隐藏的函数
  function toggleNav() {
    isNavOpen = !isNavOpen;
  }
</script>

<!-- 
  根部 <header> 元素。
  它结合了组件自身的默认样式 (sticky, bg-gray-800 等) 和从父组件传入的 className。
  这样，你在使用 <Header class="..."/> 时，传入的 class 会被应用到这里。
-->
  <div class="mx-auto flex max-w-7xl items-center justify-between p-4">
    <!-- 博客品牌/Logo -->
    <div class="nav-brand">
      <!-- 
        使用模板字符串 `${base}/` 来构建 href，以避免 Tailwind CSS 的解析错误。
        根据背景颜色，你可能需要调整这里的文本颜色。
      -->
      <a href={`${base}/`} class="text-2xl font-bold no-underline">我的博客</a>
    </div>

    <!-- 汉堡菜单按钮 (仅在小屏幕上显示) -->
    <button
      class="rounded p-2 text-white transition-colors hover:bg-gray-700 md:hidden"
      on:click={toggleNav}
      aria-expanded={isNavOpen}
      aria-label="Toggle navigation"
    >
      {#if isNavOpen}
        <!-- 关闭图标 (X) -->
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      {:else}
        <!-- 汉堡图标 (三条横线) -->
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      {/if}
    </button>

    <!-- 
      导航链接。
      使用 JS 条件判断来切换 'block' 和 'hidden'，控制移动端菜单的可见性。
      在中等及以上尺寸屏幕上 (md:), 它会始终显示为 'block'。
    -->
    <nav class="absolute left-0 top-full w-full bg-gray-800 md:static md:w-auto md:bg-transparent {isNavOpen ? 'block' : 'hidden'} md:block">
      <ul class="flex flex-col items-center md:flex-row md:space-x-2">
        <li>
          <a href={`${base}/`} class="block rounded-md px-3 py-4 text-center no-underline transition-colors hover:bg-gray-700 md:py-2">首页</a>
        </li>
        <li>
          <a href={`${base}/blog`} class="block rounded-md px-3 py-4 text-center no-underline transition-colors hover:bg-gray-700 md:py-2">所有文章</a>
        </li>
        <li>
          <a href={`${base}/tags`} class="block rounded-md px-3 py-4 text-center no-underline transition-colors hover:bg-gray-700 md:py-2">标签</a>
        </li>
        <li>
          <a href={`${base}/about`} class="block rounded-md px-3 py-4 text-center no-underline transition-colors hover:bg-gray-700 md:py-2">关于我</a>
        </li>
        <li>
          <a href={`${base}/calendar`} class="block rounded-md px-3 py-4 text-center no-underline transition-colors hover:bg-gray-700 md:py-2">日历</a>
        </li>
      </ul>
    </nav>
  </div>
