<script>
  import { onMount } from 'svelte';

  // Canvas 动画逻辑
  let canvas;
  let ctx;
  let particles = [];
  let animationFrameId;

  const numParticles = 50; // 粒子数量
  const particleSize = 2; // 粒子大小
  const particleSpeed = 0.5; // 粒子速度
  const particleColor = 'rgba(100, 100, 100, 0.5)'; // 粒子颜色

  class Particle {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.size = Math.random() * particleSize + 1;
      this.speedX = (Math.random() - 0.5) * particleSpeed;
      this.speedY = (Math.random() - 0.5) * particleSpeed;
    }

    update() {
      this.x += this.speedX;
      this.y += this.speedY;

      // 边界检测：如果粒子超出画布，将其重新定位到另一侧
      if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
      if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
    }

    draw() {
      ctx.fillStyle = particleColor;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function initParticles() {
    particles = [];
    for (let i = 0; i < numParticles; i++) {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      particles.push(new Particle(x, y));
    }
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // 清除画布

    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();
    }

    animationFrameId = requestAnimationFrame(animate);
  }

  onMount(() => {
    // Canvas 初始化
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    ctx = canvas.getContext('2d');
    initParticles();
    animate();

    // 窗口大小变化时重新初始化 Canvas
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles(); // 重新初始化粒子位置
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId); // 清除动画帧
      window.removeEventListener('resize', handleResize);
    };
  });
</script>

<div class="relative min-h-screen flex flex-col items-center justify-center bg-gray-100 text-gray-800 overflow-hidden">
  <canvas bind:this={canvas} class="absolute inset-0 z-0"></canvas>

  <div class="relative z-10 bg-white p-8 rounded-lg shadow-xl max-w-md w-full mx-4">
    <h1 class="text-4xl font-extrabold text-center mb-4 leading-tight">
      <svg width="100%" height="auto" viewBox="0 0 800 100" class="max-w-full h-auto">
        <text x="50%" y="60%" dominant-baseline="middle" text-anchor="middle"
              class="fill-current text-gray-800" font-size="70" font-family="Arial, sans-serif"
              style="text-shadow: 2px 2px 4px rgba(0,0,0,0.3);">
          欢迎来到 Zerokaze 的博客
        </text>
        <filter id="shadow">
          <feDropShadow dx="3" dy="3" stdDeviation="2" flood-color="#333" flood-opacity="0.6"/>
        </filter>
        <text x="50%" y="60%" dominant-baseline="middle" text-anchor="middle"
              class="fill-current text-gray-800" font-size="70" font-family="Arial, sans-serif"
              style="filter:url(#shadow);">
          欢迎来到 Zerokaze 的博客
        </text>
      </svg>
    </h1>
    <p class="text-md text-center mb-6">
      探索我的想法、技术见解和个人项目。
    </p>
    <button class="w-full px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition duration-300 relative overflow-hidden">
      开始阅读
      <svg class="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        <rect x="0" y="0" width="100" height="100" fill="rgba(255,255,255,0.1)" opacity="0">
          <animate attributeName="opacity" from="0" to="0.3" dur="0.5s" begin="mouseover" fill="freeze" />
          <animate attributeName="opacity" from="0.3" to="0" dur="0.5s" begin="mouseout" fill="freeze" />
        </rect>
      </svg>
    </button>
  </div>
</div>

<style>
  /* SVG 文本的定制样式 */
  h1 svg text {
    /* 这里可以添加更高级的 SVG 文本样式，例如笔触 */
    /* stroke: #fff; */
    /* stroke-width: 0.5px; */
  }
</style>