---
title: "瀑布流布局学习笔记"
publishDate: "2025-07-20"
author: "CSS"
description: "这里使用的是Tailwind CSS 实现，用columns来实现"
---

## 基础实现
这里使用的是Tailwind CSS 实现，用`columns`来实现

* 在父亲容器上用`columns-{n}`,告诉浏览器将所有的元素分为`n`列
* 在子元素上加上`break-inside-avoid`确保内容不会从中间切开

```html
<div class="columns-3 gap-4">

    <div class="break-inside-avoid mb-4 rounded-lg bg-slate-200 p-4">
        <p>这里是一些内容，模拟一张比较矮的卡片。</p>
    </div>

    <div class="break-inside-avoid mb-4 rounded-lg bg-slate-200 p-4">
        <p>这张卡片的内容非常非常多，所以它会比其他的卡片都要高。瀑布流布局的优势就是能很好地处理这种高度不一的情况，让布局看起来依然很和谐。</p>
    </div>

    <div class="break-inside-avoid mb-4 rounded-lg bg-slate-200 p-4">
        <p>卡片3</p>
    </div>

    <div class="break-inside-avoid mb-4 rounded-lg bg-slate-200 p-4">
        <p>这是一个中等高度的卡片，用来填充布局。</p>
    </div>

    <div class="break-inside-avoid mb-4 rounded-lg bg-slate-200 p-4">
        <p>卡片5</p>
    </div>
    
    <div class="break-inside-avoid mb-4 rounded-lg bg-slate-200 p-4">
        <p>卡片6，最后一张。</p>
    </div>

</div>
```



## 响应式设计


所以，我们需要让布局变得“智能”，能够根据屏幕大小自动调整列数。这在 Tailwind CSS 里非常简单，我们只需要使用它的**响应式前缀**，比如 `md:` 和 `lg:`。

- `md:` 代表中等屏幕 (medium)，通常指平板电脑。    
- `lg:` 代表大屏幕 (large)，通常指笔记本或台式电脑


```html
<div class="columns-1 gap-4 md:columns-2 lg:columns-3">

    <div class="break-inside-avoid mb-4 rounded-lg bg-slate-200 p-4">...</div>
    <div class="break-inside-avoid mb-4 rounded-lg bg-slate-200 p-4">...</div>
</div>
```
