<script lang="ts">
   import Wakatime from "$lib/components/Wakatime.svelte";
   import Todo from "$lib/components/Todo.svelte";

</script>


<div class="columns-3 min-h-screen gap-1 p-1 w-full flex">
   <div class="w-1/3 break-inside-avoid">
    <Wakatime/>
    
  </div>
   <div class="w-1/3 break-inside-avoid">
      <Todo/>    
  </div>
   <div class="w-1/3 break-inside-avoid">
      <Todo/>    
  </div>
 
</div>