<script lang="ts">
  import {
    createQueries,
    createQuery,
    dataTagErrorSymbol,
  } from "@tanstack/svelte-query";
  import type { ActivityResponse, Language } from "../../type/activity";
  import axios from "axios";
  import ProgressBar from "./ProgressBar.svelte";

  const API_URL =
    "https://api.codetabs.com/v1/proxy/?quest=https://wakapi.dev/api/v1/users/zerokaze/stats";
  async function fetchActivityData(): Promise<ActivityResponse> {
    //获取接口排行榜
    const { data } = await axios.get<ActivityResponse>(API_URL);
    return data;
  }

  const activityQuery = createQuery<ActivityResponse>({
    queryKey: ["userActivity"], // 查询键
    queryFn: fetchActivityData, // 查询函数
  });
  
  let frontEndTime = $state(0);


  // $: { data: activityData, isLoading, isError, error } = $derived($activityQuery);
    const { data: activityData, isLoading, isError, error } = $derived($activityQuery);


  // 200 天
  $effect(() => {
    if (activityData) {
      if (
        activityData.data?.languages &&
        activityData.data.languages.length > 0
      ) {
        const frontEnd = new Set([
          "Svelte",
          "Typescript",
          "JavaScript",
          "Html",
          "CSS",
        ]);
        frontEndTime = 0;
        for (const lang of activityData.data.languages) {
          if (frontEnd.has(lang.name)) {
            frontEndTime += lang.total_seconds;
          }
        }
      }
    }
  });

  //解包

  //  Svelte 的渲染时机: Svelte 组件在初始渲染和状态变化时会重新执行 <script> 标签内的响应式声明 ($: 语句) 和模板。
  // console.log(topLanguage);
</script>

<div class="rounded-xl shadow-lg p-6 bg-white border border-gray-100 max-w-sm mx-auto my-8">
  {#if isLoading}
    <div class="flex flex-col items-center justify-center py-8 text-gray-600">
      <svg class="animate-spin -ml-1 mr-3 h-8 w-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      <p class="mt-3 text-lg font-medium">数据加载中...</p>
      <p class="text-sm text-gray-500">请稍候</p>
    </div>
  {:else if isError}
    <div class="text-red-600 text-center py-8">
      <svg class="h-10 w-10 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2A9 9 0 111 12a9 9 0 0118 0z"></path>
      </svg>
      <p class="font-bold text-xl mb-2">加载失败</p>
      <p class="text-md mb-4">抱歉，数据未能成功加载。</p>
      {#if error?.message}
        <p class="text-sm text-gray-600">错误信息: {error.message}</p>
      {/if}
      <button onclick={() => {/* 这里放置重试逻辑 */ alert('尝试重新加载...')}} 
              class="mt-6 px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 
                     focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-150 ease-in-out">
        点击重试
      </button>
    </div>
  {:else if activityData}
    {#if activityData.data?.languages && activityData.data.languages.length > 0}
      <div class="flex flex-col space-y-5">
        <h3 class="text-2xl font-bold text-gray-900 border-b pb-3 mb-2">零风的前端学习时长统计</h3>
        
        <p class="text-gray-700"></p>
        
        <div class="space-y-2">
          <label for="activity-progress" class="block text-md font-medium text-gray-800">总投入时间</label>
          <ProgressBar progress={frontEndTime / 3600} /> 
          <p class="text-sm text-gray-500">已投入: <span class="font-semibold text-gray-700">{(frontEndTime / 3600).toFixed(1)} 小时</span></p>
        </div>

        </div>
    {:else}
      <div class="text-gray-600 text-center py-8">
        <svg class="h-10 w-10 mx-auto mb-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        <p class="font-bold text-xl mb-2">暂无语言活动数据</p>
        <p class="text-md text-gray-700">此活动目前没有关联的语言学习记录。</p>
      </div>
    {/if}
  {:else}
    <div class="text-gray-500 text-center py-8">
      <p class="text-lg">暂无可用活动数据。</p>
      <p class="text-sm mt-2">请刷新页面或稍后重试。</p>
    </div>
  {/if}
</div>