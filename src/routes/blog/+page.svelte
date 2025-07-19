<script lang="ts">
    let  articles = [
        {
            title: "Article 1",
            description: "This is the description of article 1",
            link: "/article/1"
        },
        {
            title: "Article 2",
            description: "This is the description of article 2",
            link: "/article/2"
        },
        {
            title: "Article 3",
            description: "This is the description of article 3",
        },
        {
            title: "Article 4",
            description: "This is the description of article 4",
            link: "/article/4"
        },

    ]
</script>


<div class="min-h-screen flex flex-col items-center justify-start bg-gray-100 text-gray-800">
{#each articles as article}
    <div class="w-90/100  bg-amber-100">
        <p>title:{article.title}</p>
        <p>description:{article.description}</p>
        <a href="{article.link}">Read more</a>
    </div>
{/each}

</div>