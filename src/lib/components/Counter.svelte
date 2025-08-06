<script lang="ts">
  import { fly, slide } from 'svelte/transition';
  import { quintOut } from 'svelte/easing';
  import { onDestroy, tick } from 'svelte';

  let count = $state(0);
  let pulseDirection: 'up' | 'down' | '' = $state('');

  // 辅助函数，用于强制重绘和触发动画
  async function triggerPulseAnimation(direction: 'up' | 'down') {
    // 1. 先将动画类名清空
    pulseDirection = '';

    // 2. 使用 tick() 等待 DOM 更新，强制浏览器重绘
    await tick();

    // 3. 重新设置动画类名，触发动画
    pulseDirection = direction;
  }

  function increment() {
    count++;
    triggerPulseAnimation('up');
  }

  function decrement() {
    count--;
    triggerPulseAnimation('down');
  }
</script>

<div class="counter" class:pulse-up={pulseDirection === 'up'} class:pulse-down={pulseDirection === 'down'}>
  <button onclick={decrement}>-</button>
  <button onclick={increment}>+</button>

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
  /* 样式与你的代码相同，无需修改 */
  .counter {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 20px;
    font-size: 3em;
    font-family: 'Arial', sans-serif;
    padding: 20px;
    border-radius: 15px;
    background-color: #282c34;
    color: #61dafb;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
    transition: transform 0.2s ease-out;
  }

  .counter button {
    background-color: #61dafb;
    color: #282c34;
    border: none;
    padding: 10px 20px;
    font-size: 1em;
    border-radius: 8px;
    cursor: pointer;
    transition: background-color 0.2s ease, transform 0.1s ease;
    box-shadow: 0 3px 6px rgba(0, 0, 0, 0.2);
  }

  .counter button:hover {
    background-color: #4fa3d1;
    transform: translateY(-2px);
  }

  .counter button:active {
    background-color: #3e8eb5;
    transform: translateY(0);
  }

  .animated-number {
    display: inline-block;
    min-width: 50px;
    text-align: center;
    position: relative;
  }

  @keyframes pulseUp {
    0% { transform: scale(1); }
    50% { transform: scale(1.05); }
    100% { transform: scale(1); }
  }

  @keyframes pulseDown {
    0% { transform: scale(1); }
    50% { transform: scale(0.95); }
    100% { transform: scale(1); }
  }

  .pulse-up {
    animation: pulseUp 0.4s ease-out forwards;
  }

  .pulse-down {
    animation: pulseDown 0.4s ease-out forwards;
  }
</style>