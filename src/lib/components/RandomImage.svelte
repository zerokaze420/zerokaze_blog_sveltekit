<script>
  let imageUrl = '';
  let loading = true; // 初始状态设为加载中

  async function loadImage() {
    try {
      const res = await fetch('https://img.paulzzh.com/touhou/random?type=json');
      const data = await res.json();
      
      // 仅使用preview小图
      imageUrl = data.preview;
      
      // 处理Konachan的特殊编码
      if (imageUrl?.includes('konachan.net')) {
        imageUrl = imageUrl
          .replace(/Konachan\.com%20-%20\d+%20/, '')
          .replace(/%20/g, ' ');
      }
    } catch (err) {
      console.error("图片加载失败:", err);
    } finally {
      loading = false;
    }
  }

  // 组件加载时自动获取
  loadImage();
</script>

<div class="image-container">
  {#if loading}
    <p class="loading-text">图片加载中...</p>
  {:else if imageUrl}
    <img 
      src={imageUrl} 
      alt="" 
      class="preview-image"
      on:error={() => console.error('图片加载失败')}
    />
  {:else}
    <p class="error-text">未能加载图片</p>
  {/if}
</div>

<style>
  .image-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
  }
  
  .preview-image {
    max-width: 300px;  /* 限制小图尺寸 */
    max-height: 300px;
    /* border-radius: 4px; */
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
  
  .loading-text, .error-text {
    color: #666;
    font-size: 14px;
    margin: 20px;
  }
  
  .error-text {
    color: #ff6b6b;
  }
</style>