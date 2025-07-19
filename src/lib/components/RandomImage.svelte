<script lang="ts">
  let timestamp = Date.now();

  function refreshImage() {
    timestamp = Date.now(); // 更新时间戳以刷新图片
  }
</script>

<div class="flex flex-col items-center justify-center min-h-screen p-4">
  <div class="w-full max-w-md">
    <div class="relative rounded-lg overflow-hidden shadow-lg bg-gray-100 dark:bg-gray-800 transition-opacity duration-300">
      <img
        src={` https://app.zichen.zone/api/acg/api.php`}
        alt="随机ACG图片"
        class="w-full h-auto object-cover"
        on:load={() => {
          // 可选：加载完成后的动画
        }}
      />
    </div>

    <button
      on:click={refreshImage}
      class="mt-4 w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition duration-300"
    >
      🔁 刷新图片
    </button>
  </div>
</div>