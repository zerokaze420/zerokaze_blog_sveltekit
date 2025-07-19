<script lang="ts">
	// 导入 Svelte 5 的响应式 API，增加了 $derived
	import { $state, $effect, $derived } from 'svelte';

	// --- 类型定义 (无变化) ---
	interface CalendarEvent {
		date: string;
		image: string;
		title: string;
	}
	interface CalendarCell {
		day: number | null;
		event?: CalendarEvent;
	}

	// --- 1. 模拟事件数据 (无变化) ---
	const events: CalendarEvent[] = [
		{ date: '2025-07-04', image: 'https://images.unsplash.com/photo-1599580506457-96ae52a5de6a?w=800', title: '美国独立日' },
		{ date: '2025-07-15', image: 'https://images.unsplash.com/photo-1594132322491-64531846c4f9?w=800', title: '夏日祭典' },
		{ date: '2025-07-22', image: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800', title: '音乐节' },
	];

	// --- 2. 日历状态 (无变化) ---
	let year = $state(2025);
	let month = $state(6); // 0-indexed, 6 代表 7 月
	let calendarGrid = $state<CalendarCell[]>([]);

	// --- ✨ 新增: 使用 $derived 创建衍生状态 ---
	// title 会在 year 或 month 变化时自动重新计算，非常优雅！
	const title = $derived(
		new Date(year, month).toLocaleString('zh-CN', { // 使用 zh-CN 本地化
			year: 'numeric',
			month: 'long'
		})
	);

	// --- 3. 悬浮图片状态 (无变化) ---
	let activeImage = $state<string | null>(null);
	let mouseX = $state(0);
	let mouseY = $state(0);

	// --- 4. 生成日历的函数 (无变化) ---
	function generateCalendar(y: number, m: number) {
		const grid: CalendarCell[] = [];
		const date = new Date(y, m, 1);
		const firstDayOfWeek = date.getDay(); // 0=周日, 1=周一, ...
		const daysInMonth = new Date(y, m + 1, 0).getDate();

		for (let i = 0; i < firstDayOfWeek; i++) {
			grid.push({ day: null });
		}
		for (let i = 1; i <= daysInMonth; i++) {
			const currentDateStr = `${y}-${String(m + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
			const event = events.find((e) => e.date === currentDateStr);
			grid.push({ day: i, event: event });
		}
		calendarGrid = grid;
	}

	// --- 5. 使用 $effect 来响应状态变化 (无变化) ---
	$effect(() => {
		generateCalendar(year, month);
	});

	// --- 6. 事件处理器 (无变化) ---
	function handleMouseMove(event: MouseEvent) {
		mouseX = event.clientX;
		mouseY = event.clientY;
	}
	function showImage(event: CalendarEvent | undefined) {
		if (event) {
			activeImage = event.image;
		}
	}
	function hideImage() {
		activeImage = null;
	}
</script>

<div class="calendar-container" on:mousemove={handleMouseMove}>
	<h1>{title}</h1>

	<div class="calendar-grid">
		{#each ['日', '一', '二', '三', '四', '五', '六'] as dayName}
			<div class="day-name">{dayName}</div>
		{/each}

		{#each calendarGrid as cell}
			<div
				class="calendar-day"
				class:empty={!cell.day}
				class:has-event={cell.event}
				on:mouseenter={() => showImage(cell.event)}
				on:mouseleave={hideImage}
			>
				<span>{cell.day}</span>
			</div>
		{/each}
	</div>

	<div
		class="floating-image"
		class:visible={activeImage}
		style="--x: {mouseX}px; --y: {mouseY}px;"
	>
		{#if activeImage}
			<img src={activeImage} alt="Event" />
		{/if}
	</div>
</div>

<style>
	.calendar-container {
		width: 100%;
		max-width: 1200px;
		margin: 2rem auto;
		font-family: sans-serif;
		position: relative;
	}

	h1 {
		text-align: center;
		margin-bottom: 2rem;
	}

	.calendar-grid {
		display: grid;
		grid-template-columns: repeat(7, 1fr);
		gap: 5px;
	}

	.day-name {
		font-weight: bold;
		text-align: center;
		padding-bottom: 10px;
	}

	.calendar-day {
		aspect-ratio: 1 / 1;
		border: 1px solid #eee;
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 1.2rem;
		cursor: pointer;
		transition: background-color 0.3s;
		user-select: none;
	}

	.calendar-day.empty {
		background-color: #f9f9f9;
		cursor: default;
	}

	.calendar-day.has-event {
		background-color: #f0faff;
		font-weight: bold;
	}

	.calendar-day:not(.empty):hover {
		background-color: #e0f0ff;
	}

	.floating-image {
		position: fixed;
		left: var(--x);
		top: var(--y);
		transform: translate(-50%, -50%) scale(0.8);
		width: 300px;
		height: 300px;
		border-radius: 10px;
		overflow: hidden;
		pointer-events: none;
		/* 初始状态为透明 */
		opacity: 0;
		transition:
			transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1),
			opacity 0.3s ease;
		z-index: 99;
	}

	.floating-image img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	/* ✨ 修改点 2 的 CSS 部分: 当 .visible 类存在时，应用这些样式来触发动画 */
	.floating-image.visible {
		transform: translate(-50%, -50%) scale(1);
		opacity: 1;
	}
	/* 移除了有问题的 :global(.floating-image) 规则 */
</style>