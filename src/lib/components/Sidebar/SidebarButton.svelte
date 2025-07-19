<script lang="ts">
	// Svelte 5: 定义组件可接收的属性
	// `class: className` 是为了避免 `class` 关键字冲突
	let { class: className = '' } = $props();
</script>

<button
	type="button"
	class="rounded-md p-2 transition {className}"
	aria-label="切换导航菜单"
	{...$$restProps}
>
	<svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
		<path
			stroke-linecap="round"
			stroke-linejoin="round"
			stroke-width="2"
			d="M4 6h16M4 12h16m-7 6h7"
		></path>
	</svg>
</button>
