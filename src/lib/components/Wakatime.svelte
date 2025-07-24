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

<div>
  {#if isLoading}
    <div>加载中...</div>
  {:else if isError}
    <div>
      加载失败: {error?.message}
    </div>
  {:else if activityData}
    {#if activityData.data?.languages && activityData.data.languages.length > 0}
      <ProgressBar progress = {frontEndTime / 3600} /> 
    {:else}
      N/A
    {/if}
  {/if}
</div>
