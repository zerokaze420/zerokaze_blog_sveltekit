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
            link: "/article/2"

        },
        {
            title: "Article 4",
            description: "This is the description of article 4",
            link: "/article/4"
        },
        {
            title: "Article 5",
            description: "This is the description of article 5",
            link: "/article/5"
        }

    ]
</script>


<div class="min-h-screen columns-1  gap-4 md:columns-2 lg:columns-3 bg-gray-100 text-gray-800">
{#each articles as article}
    <div class="w-90/100 break-inside-avoid mb-4  bg-slate-200 rounded-lg p-4">
        <p>title:{article.title}</p>
        <p>description:{article.description}</p>
        <a href="{article.link}">Read more</a>
    </div>
{/each}
</div>