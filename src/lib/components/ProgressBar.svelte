<script lang="ts">
    export let progress = 10;
</script>

<div class="progress-bar-container">
  <div class="progress-bar-fill" style="width: {progress}%;"></div>
</div>


<style>
  /* CSS 样式和之前的一样 */
  .progress-bar-container {
    width: 100%;
    height: 20px;
    background-color: #e0e0e0;
    border-radius: 10px;
    overflow: hidden;
  }

  .progress-bar-fill {
    height: 100%;
    /* 初始宽度为0，这里不需要设置，因为它会由 `progress` 变量控制 */
    background-color: #4CAF50;
    border-radius: 10px;
    /* transition 让宽度变化更平滑 */
    transition: width 0.5s ease-in-out;
  }
</style>