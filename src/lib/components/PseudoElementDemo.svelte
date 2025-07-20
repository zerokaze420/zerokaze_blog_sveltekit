<script>
  let inputValue = '';
</script>

<div class="container">
  <h2>CSS 伪元素在 Svelte 中的应用</h2>

  <p class="styled-paragraph">
    这是一个示例文本，用于展示 `::first-line` 和 `::first-letter` 伪元素。
    这段文字的第一行会以粗体显示，并且第一个字母会有特殊的样式。
  </p>

  <button class="action-button">
    点击我
  </button>

  <input type="text" bind:value={inputValue} placeholder="输入一些文字...">

  <ul>
    <li>苹果</li>
    <li>香蕉</li>
    <li>橙子</li>
  </ul>
</div>

<style>
  .container {
    padding: 20px;
    border: 1px solid #eee;
    border-radius: 8px;
    background-color: #f9f9f9;
    margin-bottom: 20px;
  }

  /* ::first-line 伪元素 */
  .styled-paragraph::first-line {
    font-weight: bold;
    color: #0056b3;
    font-size: 1.1em;
  }

  /* ::first-letter 伪元素 */
  .styled-paragraph::first-letter {
    font-size: 2.5em;
    color: #28a745;
    float: left;
    margin-right: 5px;
    line-height: 1;
  }

  /* ::before 和 ::after 伪元素用于按钮 */
  .action-button {
    background-color: #007bff;
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    position: relative; /* 确保伪元素可以相对于按钮定位 */
    overflow: hidden; /* 隐藏超出按钮范围的伪元素 */
  }

  .action-button::before {
    content: '✨'; /* 插入一个星星图标 */
    position: absolute;
    left: -20px; /* 初始位置在按钮左侧外 */
    top: 50%;
    transform: translateY(-50%);
    transition: all 0.3s ease-out;
  }

  .action-button:hover::before {
    left: 10px; /* 鼠标悬停时移动到按钮内部 */
  }

  .action-button::after {
    content: '🎉'; /* 插入一个派对图标 */
    position: absolute;
    right: -20px; /* 初始位置在按钮右侧外 */
    top: 50%;
    transform: translateY(-50%);
    transition: all 0.3s ease-out;
  }

  .action-button:hover::after {
    right: 10px; /* 鼠标悬停时移动到按钮内部 */
  }

  /* ::placeholder 伪元素 */
  input::placeholder {
    color: #aaa;
    font-style: italic;
  }

  /* ::selection 伪元素 */
  ::selection {
    background-color: #ffe0b3;
    color: #333;
  }

  /* ::marker 伪元素 */
  ul {
    list-style: none; /* 移除默认列表样式 */
    padding-left: 0;
  }

  li::marker {
    content: '➡️ '; /* 自定义列表标记 */
    color: #dc3545;
  }
</style>