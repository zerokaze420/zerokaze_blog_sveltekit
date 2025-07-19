<script lang="ts">
	// 导入 Svelte 5 的响应式 API
	import { $state, $effect } from 'svelte';

	// --- 类型定义 ---
	// 定义日历事件的数据结构
	interface CalendarEvent {
		date: string; // 格式: YYYY-MM-DD
		image: string;
		title: string;
	}

	// 定义日历网格中每个单元格的数据结构
	interface CalendarCell {
		day: number | null;
		event?: CalendarEvent;
	}

	// --- 1. 模拟事件数据 (保持不变) ---
	const events: CalendarEvent[] = [
		{ date: '2025-07-04', image: 'https://images.unsplash.com/photo-1599580506457-96ae52a5de6a?w=800', title: '美国独立日' },
		{ date: '2025-07-15', image: 'https://images.unsplash.com/photo-1594132322491-64531846c4f9?w=800', title: '夏日祭典' },
		{ date: '2025-07-22', image: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800', title: '音乐节' },
	];

	// --- 2. 日历状态 (使用 $state) ---
	// 使用 $state() 创建响应式变量。当它们的值改变时，UI 会自动更新。
	let year = $state(2025);
	let month = $state(6); // 0-indexed, 6 代表 7 月
	let calendarGrid = $state<CalendarCell[]>([]);

	// --- 3. 悬浮图片状态 (使用 $state) ---
	let activeImage = $state<string | null>(null);
	let mouseX = $state(0);
	let mouseY = $state(0);

	// --- 4. 生成日历的函数 (保持不变) ---
	function generateCalendar(y: number, m: number) {
		const grid: CalendarCell[] = [];
		const date = new Date(y, m, 1);
		const firstDayOfWeek = date.getDay(); // 0=周日, 1=周一, ...
		const daysInMonth = new Date(y, m + 1, 0).getDate();

		// 添加前面的空白格子
		for (let i = 0; i < firstDayOfWeek; i++) {
			grid.push({ day: null });
		}

		// 添加当月的日期
		for (let i = 1; i <= daysInMonth; i++) {
			const currentDateStr = `${y}-${String(m + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
			const event = events.find(e => e.date === currentDateStr);
			grid.push({ day: i, event: event });
		}
		calendarGrid = grid;
	}

	// --- 5. 使用 $effect 来响应状态变化 ---
	// $effect 会在它依赖的任何 $state 变量 (这里是 year 和 month) 改变时自动重新运行。
	// 这完美地替代了 onMount 和手动的更新调用。
	$effect(() => {
		generateCalendar(year, month);
	});

	// --- 6. 事件处理器 (保持不变) ---
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

<!-- HTML 模板部分完全不需要改变 -->
<div class="calendar-container" on:mousemove={handleMouseMove}>
	<h1>July 2025</h1>

	<div class="calendar-grid">
		{#each ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as dayName}
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

	{#if activeImage}
		<div class="floating-image" style="--x: {mouseX}px; --y: {mouseY}px;">
			<img src={activeImage} alt="Event" />
		</div>
	{/if}
</div>

<!-- 样式部分也完全不需要改变 -->
<style>
	.calendar-container {
		width: 100%;
		max-width: 1200px;
		margin: 2rem auto;
		font-family: sans-serif;
		position: relative; /* 为悬浮图片定位 */
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
		aspect-ratio: 1 / 1; /* 保持正方形 */
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
		position: fixed; /* 使用 fixed 定位，跟随视口 */
		left: var(--x);
		top: var(--y);
		transform: translate(-50%, -50%) scale(0.8); /* 从中心点定位并缩小 */
		width: 300px;
		height: 300px;
		border-radius: 10px;
		overflow: hidden;
		pointer-events: none; /* 让鼠标事件穿透图片 */
		opacity: 0;
		transition: transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1), opacity 0.3s ease;
		z-index: 99;
	}

	.floating-image img {
		width: 100%;
		height: 100%;
		object-fit: cover; /* 保证图片不变形 */
	}

	/* 当 activeImage 有值时，Svelte 会自动处理这里的逻辑 */
	:global(.floating-image) {
		transform: translate(-50%, -50%) scale(1);
		opacity: 1;
	}
</style>
