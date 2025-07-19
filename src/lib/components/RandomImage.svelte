<script lang="ts">
  // 定义图片数据的类型
  interface ImageData {
    code: string;
    imgurl: string;
    width: string;
    height: string;
  }

  // 状态变量
  let imageUrl = '';
  let width = '';
  let height = '';
  let loading = true;
  let error: string | null = null;

  async function fetchRandomImage(): Promise<void> {
    loading = true;
    error = null;

    try {
      const response = await fetch('https://www.dmoe.cc/random.php?return=json');
      if (!response.ok) throw new Error('网络响应失败');

      const data: ImageData = await response.json();

      if (data.code === '200') {
        imageUrl = data.imgurl;
        width = data.width;
        height = data.height;
      } else {
        throw new Error('图片获取失败');
      }
    } catch (err) {
      error = err instanceof Error ? err.message : '未知错误';
      imageUrl = '';
    } finally {
      loading = false;
    }
  }

  // 页面加载时自动获取图片
  fetchRandomImage();
</script>

<style>
  .image-container {
    text-align: center;
    margin: 20px;
  }

  img {
    max-width: 100%;
    height: auto;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  }

  .loading, .error {
    font-size: 1.2em;
    color: #888;
  }

  button {
    margin-top: 10px;
    padding: 10px 20px;
    font-size: 1em;
    cursor: pointer;
    border: none;
    background-color: #0078ff;
    color: white;
    border-radius: 5px;
    transition: background-color 0.3s ease;
  }

  button:hover {
    background-color: #005fcc;
  }
</style>

<div class="image-container">
  {#if loading}
    <div class="loading">加载中...</div>
  {:else if error}
    <div class="error">图片加载失败: {error}</div>
    <button on:click={fetchRandomImage}>重试</button>
  {:else}
    <img src={imageUrl} alt="随机图片" width={width} height={height} />
    <button on:click={fetchRandomImage}>换一张</button>
  {/if}
</div>