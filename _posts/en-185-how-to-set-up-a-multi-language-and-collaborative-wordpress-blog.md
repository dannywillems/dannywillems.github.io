---
ID: 185
post_title: >
  How to set up a multi-language and
  collaborative wordpress blog
author: Danny Willems
post_date: 2016-01-05 22:24:48
post_excerpt: ""
layout: post
permalink: >
  https://blog.danny-willems.be/en/how-to-set-up-a-multi-language-and-collaborative-wordpress-blog/
published: true
---
<h2 class="text-center">A multi-language and collaborative blog</h2>

When I decided to write a blog with WordPress, I had some difficulties choosing to write in French or in English and I would something collaborative.
I decided to begin in English because I thought I would have more visitors and it would be a good writing exercise.

After some days and searches about French blogs, I figured out that there were a lot of French blogs without English translations. Some argue they wanted to keep a French community and others because they don't have knowledge to write in English.

Besides these reasons, I found some bad quality articles and I wanted to improve that.

So, it was finally decided! I'll write in both French and English.
I know I won't be able to write in both languages, and I'll make a lot of errors in English.

Addicted to the open source philosophy, I found a solution which is to put my articles on a collaborative platform such as <a href="http://github.com">GitHub</a> and allow pull requests from people to improve my articles. On top of that, my articles could be easily translated in other languages.

Here are two plugins I found to setup a collaborative and multi-language blog.

<div class="dw-quote">It's not a tutorial to learn how to use these plugins. There're plenty of tutorial on the web.</div>

<h2 class="text-center">Multi language: <a href="https://fr.wordpress.org/plugins/polylang/">Polylang</a></h2>

The first step is to install a plugin to allow to redact in several languages. I chose <a href="https://fr.wordpress.org/plugins/polylang/">Polylang</a> because it's easy to install and doesn't perform persistent changes.

<h2 class="text-center">Collaborative: <a href="https://github.com/mAAdhaTTah/wordpress-github-sync">Wordpress Github Sync</a></h2>

GitHub is a good platform to share our code, and it's the platform I chose.
After some searches about a plugin which allows to export and import from GitHub, I found <a href="https://github.com/mAAdhaTTah/wordpress-github-sync">Wordpress Github Sync</a>.
It's also easy to install and it's very simple to use.

<h2 class="text-center">Merge these two plugins</h2>

I wasn't entirely satisfied when I began to use them. Individually, it's perfect, but there're some inconveniences when you try to export to GitHub the same article written in French and in English.
By default, WordPress GitHub Sync exports as <strong>Y-m-d-article_name</strong>. The problem is you have to look at the article name to know which language is. I wanted something like <strong>lang-article_name</strong>, the date isn't important for me.

I decided to modify the GitHub plugins (which can be found <a href="https://github.com/dannywillems/wordpress-github-sync">here</a>). It exports as <strong>lang-article_name</strong> by parsing the permalink (supposed to be in the form http://domain/lang/article_name).
I added a get_lang method into the post.php file and changed the github_filename method.

<div class="dw-quote">The result can be found on my GitHub: <a href="https://github.com/dannywillems">dannywillems</a>, and my articles in <a href="https://github.com/dannywillems/blog.danny-willems.be">this repository</a></div>