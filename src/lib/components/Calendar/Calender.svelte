<script lang="ts">
	import { onMount, onDestroy } from 'svelte';

	interface CalendarEvent {
		date: string;
		image: string;
		title: string;
	}
	interface CalendarCell {
		day: number | null;
		event?: CalendarEvent;
	}

	const events: CalendarEvent[] = [
		{ date: '2025-07-04', image: 'https://images.unsplash.com/photo-1599580506457-96ae52a5de6a?w=800', title: '美国独立日' },
		{ date: '2025-07-15', image: 'https://images.unsplash.com/photo-1594132322491-64531846c4f9?w=800', title: '夏日祭典' },
		{ date: '2025-07-22', image: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800', title: '音乐节' }
	];

	let year = 2025;
	let month = 6; // 0-indexed
	let calendarGrid: CalendarCell[] = [];

	let activeImage: string | null = null;
	let mouseX = 0;
	let mouseY = 0;

	let title = '';

	// 更新日历和标题
	function updateCalendar() {
		title = new Date(year, month).toLocaleString('zh-CN', {
			year: 'numeric',
			month: 'long'
		});
		const grid: CalendarCell[] = [];
		const date = new Date(year, month, 1);
		const firstDayOfWeek = date.getDay();
		const daysInMonth = new Date(year, month + 1, 0).getDate();

		for (let i = 0; i < firstDayOfWeek; i++) {
			grid.push({ day: null });
		}
		for (let i = 1; i <= daysInMonth; i++) {
			const currentDateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
			const event = events.find((e) => e.date === currentDateStr);
			grid.push({ day: i, event });
		}
		calendarGrid = grid;
	}

	// 响应式处理
	$: updateCalendar();

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

	.floating-image.visible {
		transform: translate(-50%, -50%) scale(1);
		opacity: 1;
	}
</style>
