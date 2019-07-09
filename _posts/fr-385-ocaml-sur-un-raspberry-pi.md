---
ID: 385
post_title: OCaml sur un Raspberry Pi
author: Danny Willems
post_date: 2016-07-14 01:21:16
post_excerpt: ""
layout: post
permalink: >
  https://blog.danny-willems.be/fr/ocaml-sur-un-raspberry-pi/
published: true
---
Aujourd'hui, j'ai voulu m'amuser avec mon Raspberry Pi qui, depuis assez longtemps, n'est pas utilisé. Après avoir téléchargé la dernière version de <a href="https://www.raspberrypi.org/downloads/raspbian/">raspbian</a> et avoir installé ce dernier avec dd (voir <a href="https://www.raspberrypi.org/documentation/installation/installing-images/README.md">ici</a>), j'ai voulu écrire quelque scripts et un peu de programmation.

J'avais lu certains articles comme <a href="https://blogs.janestreet.com/bootstrapping-ocamlasync-on-the-raspberry-pi/">celui-ci de Jane Street</a> décrivant un essai d'installation d'OCaml sur un Raspberry Pi et écrire certains bouts de code avec Async. C'était clair, j'avais trouvé mon projet de la matinée: installer OCaml sur mon Raspberry Pi 1 model B+ ainsi que des paquets opam.

<h2>Installation d'OCaml</h2>

La première chose à faire est d'installer quelque dépendances comme <b class="helvetica">git</b> et <b class="helvetica">m4</b> pour pouvoir installer opam. Normalement, <b class="helvetica">git</b> est déjà installé mais pas <b class="helvetica">m4</b>.

[code lang="bash"]
sudo apt-get install m4
[/code]

Après ça, OCaml 4.01.0 peut être installé grâce à apt-get:
[code lang="bash"]
sudo apt-get install ocaml
[/code]

L'installation prend quelques minutes mais après cela, nous pouvons utiliser OCaml sans problèmes.

[caption id="attachment_287" align="aligncenter" width="553"]<a href="http://blog.danny-willems.be/wp-content/uploads/2016/06/Selection_003.png" rel="attachment wp-att-287"><img src="http://blog.danny-willems.be/wp-content/uploads/2016/06/Selection_003.png" alt="OCaml on Raspberry Pi" width="553" height="110" class="size-full wp-image-287" /></a> OCaml on Raspberry Pi[/caption]

<h2>Cloner, compiler et installer opam</h2>

Il est temps d'être capable d'utiliser opam pour installer nos packages favoris. Nous allons installer opam à partir des sources pour avoir une installation optimales. Nous avons besoin de configurer, d'installer les libraries externes, de compiler opam avant d'être prêt à l'installer. Toutes les commandes sont données sur le <a href="https://github.com/ocaml/opam">dépot Github officiel</a>:

[code lang="bash"]
git clone https://github.com/ocaml/opam
cd opam
./configure
make lib-ext
make
make install
[/code]

Le clonage et la configuration sont rapides. Les plus longues étapes sont l'installation des librairies externes et la compilation d'opam: cela prend quelques minutes.
Si vous avez un Raspberry pi 3, qui est composé d'un quad core, vous pouvez utiliser [code lang="bash"]make -j 4[/code].
Ces commandes installent la dernière version de OPAM (qui est pour l'instant 2.0) mais peut-être que vous voulez OPAM 1.2. Dans ce cas, utilisez:

[code lang="bash"]
git clone https://github.com/ocaml/opam
cd opam
git checkout -b 1.2 origin/1.2
./configure
make lib-ext
make
sudo make install
[/code]

Nous avons ensuite besoin de lancer <b class="helvetica">opam init</b>, ce qui prend quelques minutes. 

[code lang="bash"]
opam init
[/code]

<h2>Installer la dernière version d'OCaml</h2>

Avant d'utiliser un quelconque package, il serait mieux de changer vers une version d'OCaml plus récente que la 4.01.0, comme par exemple la dernière release: 4.03.0. Nous pouvons le faire en utilisant simplement <b class="helvetica">opam switch</b>

[code lang="bash"]
opam switch 4.03.0
[/code]

Cela dur très longtemps car le Raspberry Pi a besoin de compiler OCaml. Le CPU est toujorus à 100% mais le processus ne prend pas énormément de RAM: le système en entier prend 200 Mo maximum. Vous serez bloqués à cette étape pendant un certain temps.


<a href="http://blog.danny-willems.be/wp-content/uploads/2016/06/Selection_004.png" rel="attachment wp-att-293"><img src="http://blog.danny-willems.be/wp-content/uploads/2016/06/Selection_004.png" alt="opam switch 4.03.0 stuck" width="651" height="154" class="size-full wp-image-293" /></a>

Après 1 heure, nous avons une fraiche installation d'OCaml 4.03.0 sur notre Raspberry Pi:

[caption id="attachment_295" align="aligncenter" width="308"]<a href="http://blog.danny-willems.be/wp-content/uploads/2016/06/Selection_001.png" rel="attachment wp-att-295"><img src="http://blog.danny-willems.be/wp-content/uploads/2016/06/Selection_001.png" alt="ocaml 4.03.0" width="308" height="64" class="size-full wp-image-295" /></a> ocaml 4.03.0[/caption]

<h2>Installer un package opam: js_of_ocaml</h2>

Comme je suis un fan de js_of_ocaml, j'aimerais pouvoir l'utiliser sur mon Raspberry Pi.

[code lang="bash"]
opam install js_of_ocaml
[/code]

Encore une fois, aucun problème pour l'installation. Cependant, cela prend longtemps en particulier à cause de camlp4 mais tout va bien, sans problème de mémoire.