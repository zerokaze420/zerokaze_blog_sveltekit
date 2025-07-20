---
title: "CSS伪元素学习"
publishDate: "2025-07-21"
author: "CSS"
description: "在CSS中，伪元素（pseudo-elements）是用于样式化文档中特定部分的关键字"
---


## 伪元素与伪类

伪元素和伪类（pseudo-classes）经常被混淆，但它们是不同的概念：

伪类选择的是元素的特殊状态，例如 :hover（鼠标悬停）、:focus（获取焦点）或 :nth-child()（根据兄弟元素顺序选择）。

伪元素选择的是元素的特定部分，或者生成并插入内容，例如 ::first-line（首行）、::before（内容之前）或 ::marker（列表项标记）。

在CSS3中，伪元素使用双冒号 :: 表示，以区别于伪类（使用单冒号 :）。虽然为了向后兼容，一些旧的伪元素（如 :first-line）仍然支持单冒号语法，但推荐使用双冒号。


<script lang="ts"> 
import PseudoElementDemo from '$lib/components/PseudoElementDemo.svelte';
</script>

<PseudoElementDemo/>