<script lang="ts">
    import { fly, slide } from 'svelte/transition';
    import { quintOut } from 'svelte/easing'; // 引入一个更有趣的缓动函数

    let count: number = 0;
    let pulseDirection: 'up' | 'down' | '' = '';

    function increment() {
        count++;
        triggerPulse('up');
    }

    function decrement() {
        count--;
        triggerPulse('down');
    }

    function triggerPulse(direction: 'up' | 'down') {
        pulseDirection = direction;
        // 动画结束后移除 class，以便下次触发
        setTimeout(() => {
            pulseDirection = '';
        }, 400);
    }
</script>

<div class="counter" class:pulse-up={pulseDirection === 'up'} class:pulse-down={pulseDirection === 'down'}>
    <button on:click={decrement}>-</button>
        <button on:click={increment}>+</button>


    {#key count}
        <span
            class="animated-number"
            in:fly={{ y: -40, duration: 400, easing: quintOut }}
            out:slide={{ duration: 250, easing: quintOut }}
        >
            {count}
        </span>
    {/key}

</div>

<style>
    .counter {
        display: flex;
        align-items: center;
        gap: 1.5rem;
        background: linear-gradient(135deg, #667eea, #764ba2);
        padding: 1rem 2rem;
        border-radius: 9999px;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.25);
        font-family: 'Segoe UI', 'Helvetica Neue', sans-serif;
        color: white;
        transition: transform 0.2s ease-out, background 0.4s ease;
        position: relative; /* 为伪元素定位 */
        overflow: hidden; /* 隐藏溢出的伪元素 */
    }
    
    /* 背景脉冲动画 */
    .pulse-up {
        animation: pulse-up-bg 0.4s ease-out;
    }
    .pulse-down {
        animation: pulse-down-bg 0.4s ease-out;
    }

    button {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 3.5rem; /* 稍微增大按钮 */
        height: 3.5rem;
        background-color: rgba(255, 255, 255, 0.2);
        color: white;
        border: none;
        border-radius: 50%;
        font-size: 2rem;
        font-weight: bold;
        cursor: pointer;
        transition: all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275); /* 果冻效果的缓动函数 */
        backdrop-filter: blur(5px);
        z-index: 10;
    }

    button:hover {
        transform: scale(1.15) rotate(15deg); /* 夸张的悬停旋转 */
        background-color: rgba(255, 255, 255, 0.35);
        box-shadow: 0 4px 15px rgba(255, 255, 255, 0.2);
    }
    
    /* 点击时的果冻按压效果 */
    button:active {
        transform: scale(0.9) rotate(-5deg);
        transition-duration: 0.1s;
    }

    .animated-number {
        font-size: 3rem; /* 增大字号 */
        font-weight: 800;
        min-width: 3ch;
        text-align: center;
        text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3); /* 添加文字阴影 */
    }
    
    /* 增加数字时的背景脉冲动画 */
    @keyframes pulse-up-bg {
        0% { transform: scale(1); background: linear-gradient(135deg, #667eea, #764ba2); }
        50% { transform: scale(1.05); background: linear-gradient(135deg, #89f7fe, #66a6ff); } /* 脉冲时变亮 */
        100% { transform: scale(1); background: linear-gradient(135deg, #667eea, #764ba2); }
    }

    /* 减少数字时的背景脉冲动画 */
    @keyframes pulse-down-bg {
        0% { transform: scale(1); background: linear-gradient(135deg, #667eea, #764ba2); }
        50% { transform: scale(0.95); background: linear-gradient(135deg, #a255b6, #4d2f7a); } /* 脉冲时变暗 */
        100% { transform: scale(1); background: linear-gradient(135deg, #667eea, #764ba2); }
    }
</style>