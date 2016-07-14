---
ID: 50
post_title: GSMath
author: Danny Willems
post_date: 2015-12-09 21:32:15
post_excerpt: ""
layout: post
permalink: https://blog.danny-willems.be/en/gsmath/
published: true
bitly_url:
  - http://bit.ly/1OD0fXG
bitly_hash:
  - 1OD0fXG
bitly_long_url:
  - http://blog.danny-willems.be/gsmath/
---
<h2 style="text-align:center">GSMath: a math hybrid library.</h2>

In the same idea than <a href="http://blog.danny-willems.be/en/gslib">GSLib</a> GSMath is a library, available in multiple languages, keeping the same structure and the same functions. GSMath provides functions to do linear algebra (matrix), differential analysis, basic algebra, trigonometry,...

<h2 style="text-align:center">What's an hybrid library and why ?</h2>

I think programming languages must be seen as a tool, not as a "raw material".

I don't say every programming languages is equivalent in the sense there're no needs to compare them. There're better programming languages than other, and it depends on what you have to do. There're also different theoric aspects of programming languages which matters a lot. For example, you've to be foolish to code a JQuery like or a web render in brainf***. As a tool, there're better tools than other (but it's not the subject of this article, maybe later).

I think a programming language must be seen as a way to communicate with your computer as you want: the compiler or interpreter is there to translate to your machine. So, why do we have to learn a new standard library when we learn a new programming language ? Why do we have to talk differently to each interpreters and compilators ?
It's not very productive and we don't often remember basic functions because we have to switch between different syntaxes.

<div class="dw-quote">
You shouldn't be afraid about the syntax and the semantic to learn a new programming language or when you work with several languages.
</div>

For these reasons, I began to write a library I called GSMath. I say it's an hybrid library because you can use it in the programming language you want with the same namespace and the same algorithms for the implementation. The last point is I think important because when we want to learn a new programming language, it's a good way to learn to study how standards libraries are implemented.

<div class="dw-quote">
GSMath isn't always the fastest and the more efficient implementations of math libraries.
</div>