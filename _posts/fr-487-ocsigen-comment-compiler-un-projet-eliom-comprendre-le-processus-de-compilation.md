---
ID: 487
post_title: 'Ocsigen: comment compiler un projet Eliom. Comprendre le processus de compilation.'
author: Danny Willems
post_date: 2016-07-14 22:17:56
post_excerpt: ""
layout: post
permalink: >
  http://blog.danny-willems.be/fr/ocsigen-comment-compiler-un-projet-eliom-comprendre-le-processus-de-compilation/
published: true
---
Il est temps que j'écrive mon premier acticle sur <a href="http//ocsigen.org">Ocsigen</a> et spécialement sur <a href="http://ocsigen.org/eliom">Eliom</a>. J'ai commencé il y a une semaine mon stage chez <a href="https://besport.com">BeSport</a>, un réseau social centré sur les sports et entièrement développé en OCaml utilisant les projets d'OCsigen donc j'ai eu besoin d'apprendre comment Ocsigen fonctionne en général.

<h2 class="text-center">Ocsigen? Qu'est-ce que c'est ? C'est un atome non ?</h2>

Oui, oxygène est un élément chimique, mais Ocsigen est aussi un framework web OCaml commencé en 2004.

<h2 class="text-center">Attends, encore un autre framework web ? Il en existe déjà énormément des frameworks web.</h2>

Oui, je suis d'accord que ç'en est un parmis tant d'autres. Mais Ocsigen est différent sur plusieurs points.
Premièrement, Ocsigen est entièrement écrit en OCaml: pas de PHP, pas de JavaScript, pas d'HTML.
Secondement, Ocsigen contient des sous-projets indépendants qui, ensemble, forment un framework très élégant. Ici quelques-uns de ces sous-projets:

<ul>
  <li><a href="http://ocsigen.org/ocsigenserver">Ocsigenserver</a>: un serveur web entièrement écrit OCaml. Il supporte HTTPS, plusieurs hosts (virtual hosts), proxy, compression de contenu, contrôle d'accès, authentification, etc. Toute ce que vous avez besoin est implémenté et est très facile à configurer. Ocsigenserver permet également de développer des modules pour ajouter des fonctionnalités au serveur.</li>
  <li><a href="http://ocsigen.org/js_of_ocaml/">Js_of_ocaml</a>: un compilateur OCaml bytecode vers JavaScript. Il permet d'écrire des programmes OCaml et de les compiler en JavaScript. Par conséquent, on peut crire des applications web entièrement en OCaml.</li>
  <li><a href="http://ocsigen.org/eliom">Eliom</a>: une librairie haut-niveau pour construire des applications serveurs et clients. En peu de lignes de code et dans le même fichier, vous pouvez écrire des sites complexes en même temps que leur partie serveur associée. Eliom utilise le typage fort d'OCaml pour construire les routes, les pages HTML, l'échange de données entre clients et serveurs, les mécanismes de sessions, etc. Il utilise des nouveaux concepts de programmation web très intéressants et à jour avec les besoin modernes.</li>
  <li><a href="http://ocsigen.org/lwt">Lwt</a>: programmation coopérative en OCaml. C'est une librairie très populaire dans la communauté OCaml même dans les projets non-web.</li>
  <li><a href="http://ocsigen.org/tyxml">TyXML</a>: écrire des arbres XML typés (en particulier HTML). 
  <li>et bien plus encore... Vous pouvez trouver tous les sous-projets d'Ocsigen <a href="http://ocsigen.org">ici</a>.</li>
</ul>

<div class="text-center"><!--more--></div>

<h2 class="text-center">Oh génial ! Peux-tu nous montrer un exemple ?</h2>

Oui bien sûr. Je vais vous montrer un projet Eliom basique et comment le compiler. Dans d'autres articles, je montrerai des exemples sur js_of_ocaml, ocsigenserver et lwt. Le but principal de cet article est de vous montrer le processus entier pour construire un projet Eliom, du code jusqu'à la compilation en passant par la configuration du serveur ocsigenserver.

<div class="dw-quote">Cet article n'explique pas comment Eliom fonctionne et tous les modules Eliom en détails. C'est juste une explication, étape par étape, du processus de compilation d'un projet Eliom. D'autres articles viendront sur ces autres sujets.</div>

<h2 class="text-center">Comment installer Eliom ?</h2>

Premièrement, changez vers une version 4.02.3 stable d'OCaml avec opam:
[code lang="bash"]
opam switch 4.02.3
[/code]
ou si vous voulez donner un nom au compilateur, utilisez
[code lang="bash"]
opam switch eliom-build-test --alias-of 4.02.3
[/code]
De cette manière, les dépendances des packages seront les mêmes pour vous que pour moi.

La manière la plus simple d'installer Eliom est d'utiliser <a href="https://opam.ocaml.org">OPAM</a>:
[code lang="bash"]
opam install eliom
[/code]

Cette commande va installer toutes les dépendances comme lwt, js_of_ocaml, ocsigenserver et la dernière version d'Eliom (actuellement la 5.0).

<h2 class="text-center">Les outils de build</h2>

La package opam d'Eliom fournit différents outils (binaires) que vous pouvez utiliser pour compiler et commencer un projet Eliom plus facilement. La plupart d'entre eux sont des wrappers aux outils OCaml usuels:

<ul>
  <li><b class="helvetica">eliomc</b>: wrapper d'ocamlc pour les projets Eliom</li>
  <li><b class="helvetica">eliomopt</b>: wrapper d'ocamlopt pour les projets Eliom</li>
  <li><b class="helvetica">js_of_eliom</b>: wrapper de js_of_ocaml pour les projets Eliom</li>
  <li><b class="helvetica">eliom-distillery</b>: fournit des templates pour Eliom</li>
</ul>

<b class="helvetica">eliomc</b> compile en bytecode et <b class="helvetica">eliomopt</b> en code natif. Pour le reste de cet article, nous allons utiliser <b class="helvetica">eliomc</b>.

<h2 class="text-center">Un peu de code Eliom</h2>

Un projet Eliom utilise des fichiers avec une extension <b class="helvetica">.eliom</b> et <b class="helvetica">.eliomi</b> (pour l'interface). Ces types de fichiers sont des types communs de fichiers OCaml (ml et mli) et contiennent du code OCaml avec une extension de syntaxe ppx pour différencier les différentes parties serveur, client et partagées. Ces types de fichiers différents sont juste un moyen de distinguer le code OCaml standard du code utilisant Eliom (les outils de compilation d'Eliom utilisent ces différences pour les règles de compilation).

Voici un exemple de code qui définit une page contenant un paragraphe avec "Hello, World!". Collez ce code dans un fichier <b class="helvetica">hello_world.eliom</b>. Nous utiliserons ce nom de fichier pour le reste de l'article.

[cce lang="ocaml"]
[%%shared
    open Eliom_content
    open Html5.D
]

let content =
  fun () () -&gt;
    Lwt.return
      (html
        (head (title (pcdata "Hello, World!")) [])
        (body
          [p [pcdata "Hello, World!"]]
        )
      )

let main_service =
  Eliom_registration.Html5.register_service
    ~path:[]
    ~get_params:Eliom_parameter.unit
    content
[/cce]

Eliom fonctionne en terme de <b class="helvetica">services</b> et non en terme de page ou d'URL. Le service est défini par
[cce lang="ocaml"]
let main_service =
  Eliom_registration.Html5.register_service
    ~path:[]
    ~get_params:Eliom_parameter.unit
    (* content *)
[/cce]

Le service <b class="helvetica">main_service</b> retourne une page HTML5 (parce que nous utilisons le module <b class="helvetica">Eliom_registration.Html5</b>) qui a comme contenu <b class="helvetica">content</b>. La fonction <b class="helvetica">content</b> définit une page HTML5 <b class="helvetica">typée</b>: <b class="helvetica">head</b>, <b class="helvetica">body</b>, <b class="helvetica">title</b>, <b class="helvetica">pcdata</b> et <b class="helvetica">p</b> sont des fonctions définies dans le module <b class="helvetica">Eliom_content.Html5.D</b>.

Vous pouvez trouver plus d'informations à propos des services et Eliom dans les <a href="http://ocsigen.org/tuto/manual/">tutoriels officiels d'Ocsigen</a>.

<h2 class="text-center">Extraire les informations de type clients et serveurs</h2>

Même si nous n'avons pas de code client dans cet exemple, comme je l'ai dit, Eliom permet d'écrire le code client et serveur de votre application web dans un seul fichier. Plus d'information <a href="http://ocsigen.org/tuto/5.0/manual/intro">ici</a>.

La première étape pour compiler un projet Eliom est d'extraire les informations de type client et serveur. <b class="helvetica">eliomc</b> a une option (<b class="helvetica">-infer</b>) pour extraire ces informations.
<b class="helvetica">eliomc</b> copie les fichiers compilés dans un dossier appelé <b class="helvetica">_server</b>. Ce dossier peut être changé en modifiant la variable <b class="helvetica">ELIOM_SERVER_DIR</b>. C'est la même chose pour le code coté client qui sont copiés dans le dossier <b class="helvetica">_client</b>. Ce dossier peut être changé en modifiant la variable <b class="helvetica">ELIOM_CLIENT_DIR</b>.

Lors de ce tutoriel, nous utilisons la syntaxe PPX (<b class="helvetica">[%%shared (* code *)]</b> est un exemple d'enxtension PPX) donc nous avons besoin d'ajouter <b class="helvetica">-ppx</b> à chaque appel à <b class="helvetica">eliomc</b>, <b class="helvetica">eliomopt</b> et <b class="helvetica">js_of_eliom</b>.

Nous extrayons les informations de type avec
[code lang="bash"]
eliomc -ppx -infer hello_world.eliom
[/code]

<h2 class="text-center">Compiler le code coté serveur</h2>

Maintenant nous sommes prêt à compiler le code coté serveur en bytecode. Le code coté serveur doit être compilé comme une librairie pour <b class="helvetica">Ocsigenserver</b>.
[code lang="bash"]
eliomc -ppx -c hello_world.eliom # compile in bytecode
eliomc -ppx -a -o hello_world.cma _server/hello_world.cmo # build a library for ocsigenserver
[/code]

<h2 class="text-center">Compiler le code coté client</h2>

Le code coté client est essentiellement du code JavaScript provenant d'OCaml et compilé avec js_of_ocaml. Nous utilisons <b class="helvetica">js_of_eliom</b> pour récupérer le code client. Nous avons besoin d'avoir le bytecode du code coté client et utiliser ce dernier avec <b class="helvetica">js_of_eliom</b> (même procédé qu'avec <b class="helvetica">js_of_ocaml</b>) pour obtenir le JavaScript correspondant. <b class="helvetica">js_of_eliom</b> extrait la partie coté client du fichier eliom et le compile en JavaScript. Le fichier cmo correspondant est copié dans le dossier <b class="helvetica">_client</b>.

[code lang="bash"]
js_of_eliom -ppx -c hello_world.eliom # get bytecode
js_of_eliom -ppx -o hello_world.js _client/hello_world.cmo # compile in JavaScript
[/code]

<h2 class="text-center">Configuration d'Ocsigenserver</h2>

Maintenant que nous avons les fichiers compilées pour <b class="helvetica">ocsigenserver</b>: la librairie <b class="helvetica">hello_world.cma</b> qui sera chargé dans <b class="helvetica">ocsigenserver</b> et le code coté client <b class="helvetica">hello_world.js</b>. La dernière chose à faire est de configurer le serveur.

<b class="helvetica">Ocsigenserver</b> a une fonctionnalité intéressante: vous pouvez exécuter le serveur localement sur un port &gt; 1024 et la seule chose que vous devez fournir au serveur est un fichier XML. Toutes les informations peuvent être trouvées <a href="http://ocsigen.org/ocsigenserver/2.7/manual/">ici</a>. Je ne décris pas chaque ligne car ce n'est pas le but de cet article.

Si vous avez déjà configuré un serveur HTTP comme Apache, vous savez que les dossiers principaux sont:

<ul>
  <li><b class="helvetica">/var/www/html</b>: contient tous les sites dans des sous-dossiers.</li>
  <li><b class="helvetica">/etc</b>: contient le fichier de configuration, souvent dans un sous-dossier avec le nom du site.</li>
  <li><b class="helvetica">/lib</b> les fichiers de librairies.
  <li><b class="helvetica">/var/log</b>: contient tous les fichiers de logs. Souvent, nous créeons des sous-dossiers pour chaque site enregistré dans /var/www/html où les fichiers de logs sont placés.</li>
  <li><b class="helvetica">/var/data</b>: contient toutes les données. Souvent, un sous-dossier pour chaque site.</li>
  <li><b class="helvetica">/var/run</b>: contient les variables run-time.</li>
</ul>

Nous utilisons la même hiérarchie pour une configuration locale de <b class="helvetica">ocsigenserver</b> à l'exception que tous les dossiers sont créés dans un dossier local nommé <b class="helvetica">local</b>. Notre site sera appelé <b class="helvetica">hello_world</b> donc nous allons créer un sous-dossier dans chaque dossier. Nous ajoutons un sous-dossier à <b class="helvetica">local/var/www/hello_world</b> appelé <b class="helvetica">eliom</b> pour y mettre nos fichiers Eliom coté client, c'est-à-dire <b class="helvetica">hello_world.js</b>: cela permet de distinguer les autres fichiers JavaScript et CSS (appelé static).

[code lang="bash"]
mkdir -p local/var/www/html/hello_world # Site files
mkdir -p local/var/www/html/hello_world/eliom # Eliom files
mkdir -p local/etc/hello_world # Configuration files
mkdir -p local/lib/hello_world # Library file ie cma file.
mkdir -p local/var/log/hello_world # Log
mkdir -p local/var/data/hello_world # Data
mkdir -p local/var/run # Pipe to send command to ocsigenserver.
[/code]

Je donne un simple fichier de configuration pour <b class="helvetica">ocsigenserver</b>:
[code lang="xml"]
&lt;ocsigen&gt;
  &lt;server&gt;
    &lt;charset&gt;utf-8&lt;/charset&gt;

    &lt;port&gt;8080&lt;/port&gt;

    &lt;logdir&gt;local/var/log/hello_world&lt;/logdir&gt;
    &lt;datadir&gt;local/var/data/hello_world&lt;/datadir&gt;

    &lt;extension findlib-package=&quot;ocsigenserver.ext.staticmod&quot;/&gt;
    &lt;extension findlib-package=&quot;ocsigenserver.ext.ocsipersist-dbm&quot;/&gt;
    &lt;extension findlib-package=&quot;eliom.server&quot;/&gt;

    &lt;commandpipe&gt;local/var/run/hello_world-run&lt;/commandpipe&gt;
    &lt;host hostfilter=&quot;*&quot;&gt;
      &lt;static dir=&quot;local/var/www/hello_world/eliom&quot; /&gt;
      &lt;eliommodule module=&quot;local/lib/hello_world/hello_world.cma&quot; /&gt;
      &lt;eliom/&gt;
    &lt;/host&gt;
  &lt;/server&gt;
&lt;/ocsigen&gt;
[/code]

Sauvegarder ce contenu dans un fichier appelé <b class="helvetica">hello_world.conf</b>

Les balises sont assez explicites donc je ne les commente pas. Vous pouvez trouver toutes les significations dans <a href="http://ocsigen.org/ocsigenserver/2.7/manual/config">la documentation officielle.</a>.

La dernière chose à faire est de copier tous les fichiers dans la configuration <b class="helvetica">ocsigenserver</b> dans le sous-dossier correspondant du dossier <b class="helvetica">local</b>.

[code lang="bash"]
cp hello_world.cma local/lib/hello_world
cp hello_world.js local/var/www/html/hello_world/eliom
cp hello_world.conf local/etc/hello_world
[/code]

<h2 class="text-center">Lancer ocsigenserver</h2>

Maintenant, nous avons une configuration complète d'ocsigenserver et un site Eliom créé à partir de rien avec les outils donnés par l'équipé d'Ocsigen.
Pour lancer ocsigenserver avec la configuration précédente, utilisez
[code lang="bash"]
ocsigenserver -c local/etc/hello_world/hello_world.conf
[/code]

et aller à l'adresse <a href="http://localhost:8080">http://localhost:8080</a>: vous avez une application web avec un «Hello, World!» entièrement écrit en OCaml !