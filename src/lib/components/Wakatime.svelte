<script lang="ts">
 import { createQueries, createQuery, dataTagErrorSymbol } from "@tanstack/svelte-query";
 import type { ActivityResponse, Language } from "../../type/activity";
 import axios from "axios";

 const API_URL = 'https://api.codetabs.com/v1/proxy/?quest=https://wakapi.dev/api/v1/users/zerokaze/stats';
 async function fetchActivityData(): Promise<ActivityResponse> {
    //获取接口排行榜
    const { data } = await axios.get<ActivityResponse>(API_URL);
    return data;
 }

  const activityQuery = createQuery<ActivityResponse>({
    queryKey: ['userActivity'], // 查询键
    queryFn: fetchActivityData, // 查询函数
  });

  $: ({ data: activityData, isLoading, isError, error } = $activityQuery);

 //解包

//  Svelte 的渲染时机: Svelte 组件在初始渲染和状态变化时会重新执行 <script> 标签内的响应式声明 ($: 语句) 和模板。
    // console.log(topLanguage);
 
 </script>

<div>
  {#if isLoading}
    <div>
      加载中...
    </div>
  {:else if isError}
    <div>
      加载失败: {error?.message}
    </div>
  {:else if activityData} topLanguage:
    {#if activityData.data?.languages && activityData.data.languages.length > 0}
      {activityData.data.languages[0].name} ({activityData.data.languages[0].text})
    {:else}
      N/A {/if}
  {/if}
</div>