import hljs from 'highlight.js';

/**
 * Svelte action: 对元素内的代码块进行语法高亮
 * 用法: <div use:highlight>...</div>
 */
export function highlight(node: HTMLElement) {
  // 找到所有未高亮的代码块
  node.querySelectorAll('pre code').forEach((block) => {
    // 跳过已经高亮过的
    if (block.classList.contains('hljs')) return;
    hljs.highlightElement(block as HTMLElement);
  });
}
