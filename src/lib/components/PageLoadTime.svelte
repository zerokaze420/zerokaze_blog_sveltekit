<script lang="ts">
	import { browser } from '$app/environment';
	import { beforeNavigate } from '$app/navigation';
	import { onMount } from 'svelte';

	let loadTimeMs = $state<number | null>(null);
	let navStart = 0;

	if (browser) {
		navStart = performance.now();
	}

	beforeNavigate(() => {
		navStart = performance.now();
	});

	onMount(() => {
		loadTimeMs = Math.round(performance.now() - navStart);
	});
</script>

{#if browser && loadTimeMs !== null}
	<span class="load-time">本页加载耗时 {loadTimeMs}ms</span>
{/if}

<style>
	.load-time {
		font-size: 0.7rem;
		color: var(--color-text-dim);
		user-select: none;
	}
</style>
