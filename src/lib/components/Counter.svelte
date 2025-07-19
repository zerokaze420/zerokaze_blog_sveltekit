<script lang="ts">
    export let count: number = 0;
</script>

<div class="counter">
    <button on:click={() => count--}>-</button>
    <span>{count}</span>
    <button on:click={() => count++}>+</button>
</div>

<style>
    .counter {
        display: flex;
        align-items: center; /* 垂直居中 */
        gap: 1rem; /* 元素之间的间距 */
        background-color: #f0f4f8; /* 浅灰色背景 */
        padding: 0.75rem 1.25rem; /* 内边距 */
        border-radius: 9999px; /* 圆角，形成药丸形状 */
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); /* 添加一点阴影 */
        font-family: sans-serif; /* 使用无衬线字体 */
    }

    button {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 2.5rem; /* 固定宽度 */
        height: 2.5rem; /* 固定高度 */
        background-color: #4a90e2; /* 蓝色背景 */
        color: white; /* 白色文字 */
        border: none; /* 移除边框 */
        border-radius: 50%; /* 圆形按钮 */
        font-size: 1.5rem; /* 字体大小 */
        font-weight: bold; /* 字体加粗 */
        cursor: pointer; /* 鼠标悬浮时显示手形光标 */
        transition: background-color 0.2s; /* 背景色过渡效果 */
    }

    button:hover {
        background-color: #357abd; /* 鼠标悬浮时颜色变深 */
    }

    span {
        font-size: 1.75rem; /* 数字的字体大小 */
        font-weight: 600; /* 字体半粗 */
        color: #333; /* 深灰色文字 */
        min-width: 3ch; /* 至少保持3个字符的宽度，防止数字变化时抖动 */
        text-align: center; /* 文本居中 */
    }
</style>