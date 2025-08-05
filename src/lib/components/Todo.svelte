<script lang="ts">
    import type { Todo } from "../../type/todo";
    let todos: Todo[] = [
        {
            id: 1,
            text: 'Todo 1',
            completed: false
        },
        {
            id: 2,
            text: 'Todo 2',
            completed: true
        },
        {
            id: 3,
            text: 'Todo 3',
            completed: false
        }
    ]
    
</script>

<div class="bg-white max-w-sm mx-auto my-8 p-8 rounded-lg">
    <ul>
        TO List
    {#each todos as todo(todo.id)}
        <li>
            {todo.text}
        </li>
    {/each}
    </ul>
</div>

