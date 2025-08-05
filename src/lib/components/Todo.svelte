<script lang="ts">
    import type { Todo } from "../../type/todo";
    let todos: Todo[] = [
        {
            id: 1,
            text: '学习Svelte',
            completed: false
        },
        {
            id: 2,
            text: '搭建博客网站',
            completed: true
        },
        {
            id: 3,
            text: 'lychee 工具',
            completed: false
        }
    ]
    
</script>

<div class="bg-white max-w-sm mx-auto my-8 p-8 rounded-lg">
    <ul class="font-mono text-sm">
        TO List
    {#each todos as todo(todo.id)}
        <li>
            {todo.text}
        </li>
    {/each}
    </ul>
</div>

