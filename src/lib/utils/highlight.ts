import hljs from 'highlight.js';

let mermaidId = 0;

function isMermaidBlock(block: HTMLElement) {
  return block.classList.contains('language-mermaid');
}

async function renderMermaidBlocks(node: HTMLElement) {
  const blocks = Array.from(node.querySelectorAll('pre code.language-mermaid')) as HTMLElement[];
  if (blocks.length === 0) return;

  const mermaid = (await import('mermaid')).default;
  const styles = getComputedStyle(document.documentElement);
  const isLight = document.documentElement.dataset.theme === 'light';

  mermaid.initialize({
    startOnLoad: false,
    securityLevel: 'strict',
    theme: 'base',
    themeVariables: {
      background: styles.getPropertyValue('--color-bg-primary').trim(),
      primaryColor: isLight ? '#eff6ff' : '#1e293b',
      primaryTextColor: styles.getPropertyValue('--color-text-primary').trim(),
      primaryBorderColor: styles.getPropertyValue('--color-border-accent').trim(),
      lineColor: styles.getPropertyValue('--color-text-muted').trim(),
      secondaryColor: isLight ? '#f8fafc' : '#0f172a',
      tertiaryColor: isLight ? '#ffffff' : '#111827',
      fontFamily: "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif"
    }
  });

  await Promise.all(blocks.map(async (block) => {
    const pre = block.parentElement;
    if (!pre || pre.dataset.mermaidRendered === 'true') return;

    const source = block.textContent ?? '';
    const container = document.createElement('div');
    container.className = 'mermaid-chart';
    container.dataset.mermaidSource = source;

    try {
      const { svg } = await mermaid.render(`mermaid-${Date.now()}-${mermaidId++}`, source);
      container.innerHTML = svg;
    } catch (error) {
      container.classList.add('mermaid-chart-error');
      container.textContent = error instanceof Error ? error.message : 'Mermaid 图表渲染失败';
    }

    pre.dataset.mermaidRendered = 'true';
    pre.replaceWith(container);
  }));
}

/** 高亮单个代码块 */
function highlightBlock(block: HTMLElement) {
  if (isMermaidBlock(block)) return;
  if (block.classList.contains('hljs')) return;

  hljs.highlightElement(block);

  const pre = block.parentElement;
  if (!pre) return;

  // 语言标签
  const lang = block.className.match(/language-(\w+)/)?.[1];
  if (lang && !pre.querySelector('.code-lang-label')) {
    const label = document.createElement('div');
    label.className = 'code-lang-label';
    label.textContent = lang;
    pre.appendChild(label);
  }

  // 复制按钮（只加一次）
  if (!pre.querySelector('.code-copy-btn')) {
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
      } catch { /* ignore */ }
    });
    pre.appendChild(btn);
  }

  // 行号（只加一次）
  if (!pre.querySelector('.code-line-nums')) {
    const lines = block.innerHTML.split('\n');
    if (lines.length > 1) {
      const nums = document.createElement('span');
      nums.className = 'code-line-nums';
      nums.innerHTML = lines.map((_, i) => `<span>${i + 1}</span>`).join('\n');
      pre.insertBefore(nums, block);
    }
  }
}

/**
 * Svelte action: 对容器内所有代码块进行高亮 + 复制按钮
 * 使用 MutationObserver 监听动态添加的内容
 */
export function highlight(node: HTMLElement) {
  renderMermaidBlocks(node);

  // 高亮已有代码块
  node.querySelectorAll('pre code').forEach((b) => highlightBlock(b as HTMLElement));

  // 监听动态添加的代码块
  const observer = new MutationObserver(() => {
    renderMermaidBlocks(node);
    node.querySelectorAll('pre code:not(.hljs)').forEach((b) => highlightBlock(b as HTMLElement));
  });

  observer.observe(node, { childList: true, subtree: true });

  return {
    destroy() {
      observer.disconnect();
    }
  };
}
