---
ID: 188
post_title: >
  Comment installer un blog wordpress
  multi-langage et collaboratif
author: Danny Willems
post_date: 2016-01-05 22:51:29
post_excerpt: ""
layout: post
permalink: >
  https://blog.danny-willems.be/fr/comment-installer-un-blog-wordpress-multi-langage-et-collaboratif/
published: true
---
<h2 class="text-center">Un blog wordpress multi-langage et collaboratif</h2>

Quand j'ai décidé d'écrire un blog avec WordPress, je ne savais me décider entre l'anglais et le français comme langue de rédaction.
J'ai alors décidé en anglais parce que le public serait plus large et que ça me donnerait une opportunité d'améliorer mon anglais écrit.

Après quelques jours de recherches sur des blogs français, j'ai remarqué qu'il y avait beaucoup de blogs uniquement en français. Parmi les rédacteurs, il y a ceux qui veulent garder une communauté francophone et d'autres qui n'ont tout simplement pas les connaissances en anglais pour rédiger.

En plus de ça, on peut parfois trouver des articles de mauvaise qualité qu'on aimerait améliorer.

Avec ces constatations, j'ai finalement décidé de rédiger à la fois en anglais et en français. Je sais que je ne serai pas capable de rédiger tous mes articles dans les deux langues et mon anglais n'étant pas parfait, je ferai également beaucoup d'erreurs.

Addict de la philosophie open source, j'ai trouvé une solution qui me permet de mettre mes articles sur une plateforme collaborative comme <a href="http://github.com">GitHub</a> et d'accepter les changements des personnes qui veulent améliorer mes articles. Le mieux est que mes articles pourraient être traduits dans d'autres langues.

Je présente ici deux plugins que j'ai trouvés qui permettent de transformer WordPress en un blog collaboratif et multilingue.

<div class="dw-quote">Je ne rédige pas un tutoriel pour utiliser ces deux plugins : il y en a déjà beaucoup sur le web</div>

<h2 class="text-center">Multilingue : <a href="https://fr.wordpress.org/plugins/polylang/">Polylang</a></h2>

La première chose est installer le plugin permettant de rédiger en plusieurs langues. Pour cela, j'ai choisi <a href="https://fr.wordpress.org/plugins/polylang/">Polylang</a> qui est facile à installer et ne réalise pas des changements persistants.

<h2 class="text-center">Collaboratif : <a href="https://github.com/mAAdhaTTah/wordpress-github-sync">Wordpress GitHub Sync</a></h2>

GitHub est une bonne plateforme pour partager ses codes et c'est elle que j'ai choisi pour y déposer mes articles.
Après quelques recherches à propos d'un plugin qui permet d'exporter et d'importer facilement de GitHub, j'ai trouvé <a href="https://github.com/mAAdhaTTah/wordpress-github-sync">Wordpress GitHub Sync</a>.
Il est facile à installer et très simple d'utilisation.

<h2 class="text-center">Assembler les deux plugins</h2>

Je n'étais pas entièrement satisfait quand j'ai commencé à utiliser ces deux plugins. Individuellement, ils sont parfaits mais il y a des inconvénients sur le nom quand on exporte un même article rédigé en français et en anglais.
Par défaut, WordPress GitHub Sync exporte sous Y-m-d-nom_de_l_article</strong>. Le problème est qu'on doit regarder le nom de l'article pour connaitre dans quelle langue il est rédigé. Je voulais quelque chose de la forme <strong>lang-nom_de_l_article</strong>, la date n'étant pas essentielle pour moi.

J'ai alors décidé de modifier le plugin de synchronisation GitHub (disponible <a href="https://github.com/dannywillems/wordpress-github-sync">ici</a>). Il exporte sous la forme souhaitée en parsant le permalien (supposé de la forme http://domaine/lang/article_name).
J'ai ajouté une méthode get_lang dans le fichier post.php et changé la méthode github_filename.

<div class="dw-quote">Le résultat peut être trouvé sur mon GitHub : <a href="http//github.com/dannywillems">dannywillems</a>, et mes articles dans <a href="https://github.com/dannywillems/blog.danny-willems.be">ce dépôt</a></div>
