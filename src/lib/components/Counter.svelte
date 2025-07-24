<script lang="ts">
  import { fly, slide } from 'svelte/transition';
  import { quintOut } from 'svelte/easing';
  import { onDestroy } from 'svelte';

  let count = $state(0);
  let pulseDirection: 'up' | 'down' | '' = $state('');

  function increment() {
    count++;
    pulseDirection = 'up';
  }

  function decrement() {
    count--;
    pulseDirection = 'down';
  }

  let timer: ReturnType<typeof setTimeout>;

  // 使用 $effect 替代 $:
  $effect(() => {
    if (pulseDirection !== '') {
      clearTimeout(timer); // 清理上一次的 timer
      timer = setTimeout(() => {
        pulseDirection = '';
      }, 400);
    }
  });

  onDestroy(() => {
    clearTimeout(timer);
  });
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
  /* 计数器容器基础样式 */
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
    transition: transform 0.2s ease-out; /* 为脉冲动画添加平滑过渡 */
  }

  /* 按钮样式 */
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

  /* 动画数字样式 */
  .animated-number {
    display: inline-block; /* 确保动画效果能正确应用 */
    min-width: 50px; /* 确保数字变化时宽度稳定 */
    text-align: center;
    position: relative;
  }

  /* 新增：脉冲动画的关键帧 */
  @keyframes pulseUp {
    0% { transform: scale(1); }
    50% { transform: scale(1.05); } /* 稍微放大 */
    100% { transform: scale(1); }
  }

  @keyframes pulseDown {
    0% { transform: scale(1); }
    50% { transform: scale(0.95); } /* 稍微缩小 */
    100% { transform: scale(1); }
  }

  /* 新增：应用脉冲动画的类 */
  .pulse-up {
    animation: pulseUp 0.4s ease-out forwards;
  }

  .pulse-down {
    animation: pulseDown 0.4s ease-out forwards;
  }
</style>