<script lang="ts">
  import { fly, slide } from 'svelte/transition';
  import { quintOut } from 'svelte/easing';
  import { onDestroy } from 'svelte';

  let count = 0;
  let pulseDirection: 'up' | 'down' | '' = '';

  function increment() {
    count++;
    pulseDirection = 'up';
  }

  function decrement() {
    count--;
    pulseDirection = 'down';
  }

  let timer: ReturnType<typeof setTimeout>;

  // 用 $: 代替 $effect
  $: if (pulseDirection !== '') {
    clearTimeout(timer); // 清理上一次的 timer
    timer = setTimeout(() => {
      pulseDirection = '';
    }, 400);
  }

  onDestroy(() => {
    clearTimeout(timer);
  });
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
  /* 原样保留你的样式 */
</style>
