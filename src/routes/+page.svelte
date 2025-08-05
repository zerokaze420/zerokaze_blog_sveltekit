<script lang="ts">
   import Wakatime from "$lib/components/Wakatime.svelte";
   import Todo from "$lib/components/Todo.svelte";

</script>


<div class="columns-2 min-h-screen gap-4 p-6 w-full">
   <div class="w-1/2 break-inside-avoid">
    <Wakatime/>
    
  </div>
   <div class="w-1/2 break-inside-avoid">
      <Todo/>    
  </div>
 
</div>