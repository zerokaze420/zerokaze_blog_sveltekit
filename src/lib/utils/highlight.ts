import hljs from 'highlight.js';

/**
 * Svelte action: 对元素内的代码块进行语法高亮 + 添加复制按钮
 * 用法: <div use:highlight>...</div>
 */
export function highlight(node: HTMLElement) {
  node.querySelectorAll('pre code').forEach((block) => {
    const pre = block.parentElement;
    if (!pre || block.classList.contains('hljs')) return;

    // 语法高亮
    hljs.highlightElement(block as HTMLElement);

    // 添加语言标签
    const lang = (block as HTMLElement).className.match(/language-(\w+)/)?.[1];
    if (lang) {
      const label = document.createElement('div');
      label.className = 'code-lang-label';
      label.textContent = lang;
      pre.appendChild(label);
    }

    // 添加复制按钮
    const btn = document.createElement('button');
    btn.className = 'code-copy-btn';
    btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>`;
    btn.title = '复制代码';
    btn.addEventListener('click', async () => {
      const code = block.textContent ?? '';
      try {
        await navigator.clipboard.writeText(code);
        btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>`;
        btn.title = '已复制';
        setTimeout(() => {
          btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>`;
          btn.title = '复制代码';
        }, 2000);
      } catch {
        // fallback
      }
    });
    pre.appendChild(btn);

    // 添加行号
    const lines = block.innerHTML.split('\n');
    if (lines.length > 1) {
      const lineNumbers = document.createElement('span');
      lineNumbers.className = 'code-line-nums';
      lineNumbers.innerHTML = lines.map((_, i) => `<span>${i + 1}</span>`).join('\n');
      block.parentElement?.insertBefore(lineNumbers, block);
    }
  });
}
