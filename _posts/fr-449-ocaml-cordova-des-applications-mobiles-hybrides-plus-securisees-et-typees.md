---
ID: 449
post_title: >
  OCaml + Cordova = des applications
  mobiles hybrides plus sécurisées et
  typées.
author: Danny Willems
post_date: 2016-07-23 18:34:02
post_excerpt: ""
layout: post
permalink: >
  http://blog.danny-willems.be/fr/ocaml-cordova-des-applications-mobiles-hybrides-plus-securisees-et-typees/
published: true
medium_post:
  - ""
---
Depuis plusieurs mois, j'ai commencé à m'intéresser au développement d'applications mobiles. J'ai trouvé un job à Bruxelles en juillet 2015 où j'ai appris à développer des applications mobiles hybrides (ie un seul code = disponible sur différentes plateformes) avec Cordova et les techonologies du web. J'ai trouvé cela très intéressant et après plusieurs mois, je continue à développer des applications mobiles avec cette technologie. J'ai aussi découvert une communauté géniale au sujet du développement mobile et des frameworks excellents comme <a href="http://ionicframework.com/">Ionic</a>.

La majorité de ces frameworks utilise JavaScript comme langage de programmation mais je n'aime pas trop ce langage à cause du manque de typage, des retours assez étranges (égalité entre chaines de caractères et entier), les paramètres non passés aux fonctions ont une valeur undefined, etc. Je n'aime pas développer des applications mobiles avec JavaScript parce que je trouve cela moche (bien que je pense que c'est parfait pour réaliser un prototype mais pas de l'utiliser en production).

J'ai découvert OCaml à l'université, un langage impressionnant avec son typage statique inféré, son vérificateur de type au moment de la compilation, une extraordinaire communauté et... un compilateur OCaml vers JavaScript !
Donc j'ai voulu utiliser ce langage pour développer des applications mobiles avec Cordova: ce sera un des mes projets universitaire pour un semestre.
 
<div class="dw-quote">Le but de mon projet était d'être capable d'utiliser les composants natives des smartphones comme l'accéléromètre, la caméra, l'envoie de sms, etc entièrement en OCaml.</div>


<h2 class="text-center">Cordova, js_of_ocaml et gen_js_api.</h2>
<ul>
	<li><a href="https://cordova.apache.org/">Cordova</a> permet de développer des applications mobiles hybrides en utilisant les techonologies du web comme l'HTML, le CSS et la JavaScript. Pour plus d'informations, visitez <a href="https://cordova.apache.org/">le site officiel</a>. Grâce aux plugins Cordova, vous pouvez avoir accès aux composants natifs du téléphone. Pour apprendre à développer des plugins Cordova, regardez <a href="https://cordova.apache.org/docs/en/latest/guide/hybrid/plugins/index.html">le tutoriel officiel</a>. Vous pouvez trouver une liste officielle des plugins Cordova <a href="https://cordova.apache.org/plugins/">ici</a>.</li>
	<li><a href="https://ocsigen.org/js_of_ocaml">js_of_ocaml</a> fournit un compilateur OCaml vers JavaScript. Comme les applications Cordova sont développées en JavaScript, js_of_ocaml permet de développer des applications mobiles en utilisant OCaml. Pour plus d'informations, regardez <a href="http://ocsigen.org/">le projet Ocsigen</a> qui comprend js_of_ocaml.</li>
	<li><a href="https://github.com/lexifi/gen_js_api">gen_js_api</a> vise à simplifier la création de bindings OCaml vers les librairies JavaScript. Il peut être utilisé avec le compilateur js_of_ocaml.</li>
</ul>

Tous les bindings sont développés avec gen_js_api et vise à être purement fonctionnels, typés et très proches de l'interface JavaScript.

<div class="text-center"><!--more--></div>

<h2 class="text-center">Comment je peux utiliser un binding ?</h2>
<b>Nécessite le compilateur &gt;= 4.03.0</b>

J'ai créé un dépot GitHub listant tous les bindings: <a href="https://github.com/dannywillems/ocaml-cordova-plugin-list">ocaml-cordova-plugin-list</a>. Chaque binding est un package opam et peut donc être installé avec opam. Il est recommandé d'ajouter ce dépot comme fournisseur distant de package opam avec la commande

[code lang="bash"]
opam repository add cordova https://github.com/dannywillems/ocaml-cordova-plugin-list.git
[/code]

Chaque binding peut maintenant être installé. Par exemple, le binding vers le plugin de la caméra est <b class="helvetica">cordova-plugin-camera</b>. Donc, si vous voulez installer le binding de la caméra, vous devez utiliser

[code lang="bash"]
opam install cordova-plugin-camera
[/code]

Le package opam approprié est donné dans le dépot GitHub du plugin (la liste est donnée <a href="https://github.com/dannywillems/ocaml-cordova-plugin-list">ici</a>).

Si le plugin nécessite le binding vers la librairie standard JavaScript comme <b class="helvetica">device-motion</b>, vous avez besoin de pin en premier <a href="https://github.com/dannywillems/ocaml-js-stdlib">ocaml-js-stdlib</a>. Si c'est le cas, il est mentionné dans le dépot GitHub.

Si vous ne voulez pas ajouter ce dépot, vous pouvez pin manuellement chaque plugin que vous avez besoin.

<h2 class="text-center">Qu'en est-il de la documentation ?</h2>

L'interface des bindings est très proche de l'interface JavaScript initiale. Par exemple, pour <b class="helvetica">cordova-plugin-camera</b> qui vous permet de prendre une photo grâce à la fonction JavaScript <b class="helvetica">navigator.camera.getPicture</b>, vous utilisez la fonction OCaml <b class="helvetica">Cordova_camera.get_picture</b>. L'équivalent OCaml de

[cce lang="javascript"]
var success_callback = function(success) {
  console.log(success);
}

var error_callback = function(error) {
  console.log(error);
}

var options = {quality: 25; destinationType: Camera.DestinationType.DATA_URL}

navigator.camera.getPicture(success_callback, error_callback, options)
[/cce]

est

[cce lang="ocaml"]
let success_callback success = Jsoo_lib.console_log success in

let error_callback error = Jsoo_lib.console_log error in

let options =
  Cordova_camera.create_options
  ~quality:25
  ~destination_type:Cordova_camera.Data_url
  ()
in

Cordova_camera.get_picture success_callback error_callback ~opt:options ()
[/cce]

(en supposant que <b class="helvetica">Jsoo_lib.console_log</b> est le binding à la fonction <b class="helvetica">console.log</b>, voir <a href="https://github.com/dannywillems/jsoo-lib">jsoo_lib</a>). La plupart des fonctions sont implémentées en utilisant des arguments optionnels et ceux-ci se trouvant souvent à la fin, il est nécessaire d'ajouter l'argument unit.

Comme l'interface OCaml est très proche de l'interface JavaScript, aucune, voire peu de documentation est donnée. N'hésitez pas à contribuer.

La plupart des bindings possèdent une application exemple qui vous permet de comprendre comment utiliser le binding. Les bindings qui ne possèdent pas d'exemple n'ont pas été testés. N'hésitez pas à reporter les problèmes s'il y en a.

<div class="dw-quote">Vous pouvez trouver plus d'informations au niveau de ce projet sur le dépot GitHub <a href="https://github.com/dannywillems/ocaml-cordova-plugin-list">ocaml-cordova-plugin-list</a>.</div>

<h2 class="text-center">Faites attention à l'événement device_ready</h2>
La plupart des plugins créent des nouveaux objets qui ne sont disponibles qu'après l'événement <b class="helvetica">deviceready</b>. Commencez toujours vos applications mobiles OCaml avec ces lignes:

[cce lang="ocaml"]
let on_device_ready () =
(* Votre code utilisant les plugins ici *)

let _ = Cordova.Event.device_ready on_device_ready
[/cce]

Le module <b class="helvetica">Cordova</b> vient du binding à l'objet JavaScript <b class="helvetica">cordova</b>. Ce module est fourni dans le package opam <b class="helvetica">cordova</b> qui peut être installé avec

[code lang="bash"]
opam install cordova
[/code]

<h2 class="text-center">Peux-tu donner un exemple d'application à partir de zéro ?</h2>

Bien sûr. Je vais vous montrer comment écrire une application mobile hybride qui vous permet d'envoyer un SMS à quelqu'un. Si l'envoie se passe correctement, une boite de dialogue apparait disant que tout s'est bien passé sinon l'erreur y est affichée.

Vous pouvez trouver le code en entier dans <a href="https://github.com/dannywillems/ocaml-cordova-plugin-sms-example">ce dépot</a>.

[caption width="170" id="attachment_410" align="aligncenter"]<a href="http://blog.danny-willems.be/wp-content/uploads/2016/07/Selection_002.png"><img src="http://blog.danny-willems.be/wp-content/uploads/2016/07/Selection_002-170x300.png" alt="ocaml-cordova-plugin-sms-example" width="170" height="300" class="size-medium wp-image-410"></a>Exemple d'application Cordova écrite en OCaml et permettant d'envoyer un SMS[/caption]

D'autres exemples peuvent être trouvés <a href="https://github.com/dannywillems/ocaml-cordova-plugin-list">ici</a>. Voici d'autres captures d'écrans.

[caption width="167" id="attachment_415" class="col-md-6" align="alignleft"]<a href="http://blog.danny-willems.be/wp-content/uploads/2016/07/screenshot_android.png"><img src="http://blog.danny-willems.be/wp-content/uploads/2016/07/screenshot_android-167x300.png" alt="ocaml-cordova-plugin-toast-example-android" width="167" height="300" class="size-medium wp-image-415"></a>Application mobile en OCaml utilisant Cordova et affichant un toast (Android)[/caption]

[caption width="166" id="attachment_414" class="col-md-6" align="alignleft"]<a href="http://blog.danny-willems.be/wp-content/uploads/2016/07/screenshot_ios.png"><img src="http://blog.danny-willems.be/wp-content/uploads/2016/07/screenshot_ios-166x300.png" alt="ocaml-cordova-plugin-toast-example-ios" width="166" height="300" class="size-medium wp-image-414"></a>Application mobile en OCaml utilisant Cordova et affichant un toast (iOS)[/caption]

<h3>Configurer l'environnement de développement</h3>

La première chose à faire est de configurer votre environnement de développement. Pour cela, vous avez besoin de:
<ul>
	<li><b class="helvetica">Cordova</b> qui est distributé en tant que package NodeJS. Pour installer NodeJS, je recommande d'utiliser <a href="https://github.com/creationix/nvm">nvm</a>. Lisez la documentation du dépot GitHub pour installer nvm et une version de NodeJS. Après cela, installez globalement Cordova avec
[code lang="bash"]
npm install -g cordova
[/code]</li>
	<li><b class="helvetica">OCaml 4.03.0 et opam</b>. Voir <a href="https://ocaml.org">ocaml.org</a> pour installer OCaml et opam pour votre distribution. Après cela, installer OCaml 4.03.0 en utilisant
[code lang="bash"]
opam switch 4.03.0
[/code]</li>
</ul>

Maintenant vous avec un environnement de développement basique. Nous allons installer les plugins Cordova que nous avons besoin ainsi que les packages opam contenant les bindings vers ces plugins.

<h3>Créer le projet Cordova et installer les plugins Cordova</h3>

Créez un projet Cordova en utilisant
[code lang="bash"]
cordova create ocaml-cordova-plugin-sms-example
[/code]

Un projet Cordova basique a été créé dans le dossier <b class="helvetica">ocaml-cordova-plugin-sms-example</b>. Allez dans ce dossier avec
[code lang="bash"]
cd ocaml-cordova-plugin-sms-example
[/code]

Dans ce dossier, vous trouverez un dossier <b class="helvetica">www</b> qui sera inclu dans l'archive finale installée sur le smartphone. Cela fonctionne <b>exactement</b> comme un site web. Il contient un fichier <b class="helvetica">index.html</b> qui sera le premier fichier exécuté (Cordova utilise une WebView dans laquelle les fichiers web sont exécutés, comme un site standard).

Nous avons besoin d'ajouter les plateformes sur lesquelles nous voulons déployer. Si vous voulez déployer sur iOS (vous avez besoin de Mac OS X avec XCode installé), utilisez
[code lang="bash"]
cordova platform add ios
[/code]

Si vous voulez déployer pour Android, vous avez besoin d'installer <a href="https://developer.android.com/studio/index.html">le SDK Android</a>. Voir <a href="https://cordova.apache.org/docs/fr/latest/guide/platforms/android/">la documentation officielle</a> pour le processus d'installation en entier. Pour ajouter la plateforme Android au projet Cordova, utilisez
[code lang="bash"]
cordova platform add android
[/code]

<div class="dw-quote">Je ne donne pas l'exemple pour Windows/Windows Phone parce qu'il est difficile d'installer nativement OCaml sur Windows et il est nécessaire d'avoir Windows pour déployer sur Windows/Windows Phone. Cependant avec <a href="http://www.howtogeek.com/249966/how-to-install-and-use-the-linux-bash-shell-on-windows-10/">Bash on Windows</a>, tout fonctionne comme sur une distribution Linux usuelle.</div>

Maintenant vous pouvez installer les plugins. Pour cet exempke, nous avons besoin de deux plugins: <a href="https://github.com/cordova-sms/cordova-sms-plugin">cordova-plugin-sms</a> pour envoyer le message et <a href="https://github.com/apache/cordova-plugin-dialogs">cordova-plugin-dialogs</a> pour montrer la boite de dialogue. Nous pouvons les installer avec ces commandes:
[code lang="bash"]
cordova plugin add cordova-plugin-sms
cordova plugin add cordova-plugin-dialogs
[/code]

<h3>OCaml et les packages opam</h3>

Nous avons besoin de <b class="helvetica">js_of_ocaml</b> (pour compiler nos fichiers OCaml en JavaScript) et <b class="helvetica">gen_js_api</b> (pour compiler les bindings). Nous les installons en utilisant opam avec
[code lang="bash"]
opam install js_of_ocaml gen_js_api
[/code]

Après ça, nous ajoutons le fournisseur de package pour les bindings OCaml aux plugins Cordova.

[code lang="bash"]
opam repository add cordova https://github.com/dannywillems/ocaml-cordova-plugin-list.git
[/code]

Comme décrit dans le dépot, les bindings aux plugins <b class="helvetica">cordova-plugin-sms</b> et <b class="helvetica">cordova-plugin-dialogs</b> sont disponibles dans les packages opam <b class="helvetica">cordova-plugin-sms</b> et <b class="helvetica">cordova-plugin-dialogs</b>. Donc, nous utilisons:
[code lang="bash"]
opam install cordova-plugin-sms cordova-plugin-dialogs
[/code]

A cause de l'événement <b class="helvetica">deviceready</b>, nous avons besoin du binding vers l'objet JavaScript cordova (comme dit dans le dépot GitHub). Nous l'installons avec

[code lang="bash"]
opam install cordova
[/code]

Nous allons également utiliser quelques fonctions venant de <a href="https://github.com/dannywillems/jsoo-lib">jsoo_lib</a>, une petite librairie que j'écris contenant des bindings vers des fonctions usuelles en JavaScript. Vous avez besoin de pin le dépot et de l'installer avec opam:
[code lang="bash"]
opam pin add jsoo_lib https://github.com/dannywillems/jsoo-lib.git
[/code]

Nous avons maintenant fini la configuration de notre environnement de développement. Passons au code !

<h3>index.html et design</h3>
Nous utilisons <a href="http://materializecss.com/">materializecss</a> comme framework CSS. Déplacez-vous dans le dossier www et utilisez npm pour l'installer:
[code lang="bash"]
cd www &amp;&amp; npm install materialize-css
[/code]

Pour le design, nous avons besoin de deux inputs et un bouton pour envoyer le message. Remplaçons le contenu du fichier <b class="helvetica">index.html</b> avec: 

[code lang="html"]
&lt;!DOCTYPE html&gt;
&lt;html&gt;
  &lt;head&gt;
    &lt;meta http-equiv=&quot;Content-Security-Policy&quot; content=&quot;default-src 'self' data: gap: https://ssl.gstatic.com 'unsafe-eval'; style-src 'self' 'unsafe-inline'; media-src *&quot;&gt;
    &lt;meta name=&quot;format-detection&quot; content=&quot;telephone=no&quot;&gt;
    &lt;meta name=&quot;msapplication-tap-highlight&quot; content=&quot;no&quot;&gt;
    &lt;meta name=&quot;viewport&quot; content=&quot;user-scalable=no, initial-scale=1, maximum-scale=1, minimum-scale=1, width=device-width&quot;&gt;
    &lt;link rel=&quot;stylesheet&quot; type=&quot;text/css&quot; href=&quot;css/index.css&quot;&gt;
    &lt;!-- CSS setup for materialize --&gt;
    &lt;link rel=&quot;stylesheet&quot; type=&quot;text/css&quot; href=&quot;node_modules/materialize-css/dist/css/materialize.min.css&quot;&gt;
    &lt;script type=&quot;text/javascript&quot; src=&quot;cordova.js&quot;&gt;&lt;/script&gt;
    &lt;script type=&quot;text/javascript&quot; src=&quot;js/main.js&quot;&gt;&lt;/script&gt;
    &lt;title&gt;OCaml Cordova Plugin: Sms&lt;/title&gt;
  &lt;/head&gt;
  &lt;body&gt;
    &lt;script type=&quot;text/javascript&quot; src=&quot;node_modules/jquery/dist/jquery.min.js&quot;&gt;&lt;/script&gt;
    &lt;script type=&quot;text/javascript&quot; src=&quot;node_modules/materialize-css/dist/js/materialize.js&quot;&gt;&lt;/script&gt;
    &lt;div class=&quot;row&quot;&gt;
      &lt;form class=&quot;col s12&quot;&gt;
      &lt;div class=&quot;row&quot;&gt;
        &lt;div class=&quot;input-field col s12&quot;&gt;
        &lt;input id=&quot;num&quot; type=&quot;tel&quot; class=&quot;validate&quot;&gt;
        &lt;label for=&quot;num&quot;&gt;Phone number&lt;/label&gt;
        &lt;/div&gt;
        &lt;div class=&quot;input-field col s12&quot;&gt;
        &lt;input id=&quot;msg&quot; type=&quot;text&quot; class=&quot;validate&quot;&gt;
        &lt;label for=&quot;msg&quot;&gt;Your message&lt;/label&gt;
        &lt;/div&gt;
        &lt;div class=&quot;input-field col s12 center&quot;&gt;
        &lt;button class=&quot;btn waves-effect waves-light&quot; id=&quot;submit&quot; type=&quot;submit&quot; name=&quot;action&quot;&gt;Send&lt;i class=&quot;material-icons right&quot;&gt;send&lt;/i&gt;&lt;/button&gt;
        &lt;/div&gt;
      &lt;/div&gt;
      &lt;/form&gt;
    &lt;/div&gt;
  &lt;/body&gt;
&lt;/html&gt;
[/code]

Pour avoir les icones du Material Design, nous avons besoin d'écrire un fichier CSS. Nous ajoutons également un padding-top. Supprimez en entier le contenu du fichier <b class="helvetica">css/index.css</b> et insérer le contenu suivant:

[code lang="css"]
body
{
  padding-top: 25px;
}
 
/* fallback */
@font-face {
  font-family: 'Material Icons';
  font-style: normal;
  font-weight: 400;
  src: local('Material Icons'), local('MaterialIcons-Regular'), url(../fonts/material_icons.ttf) format('ttf');
}
 
.material-icons {
  font-family: 'Material Icons';
  font-weight: normal;
  font-style: normal;
  font-size: 24px;
  line-height: 1;
  letter-spacing: normal;
  text-transform: none;
  display: inline-block;
  white-space: nowrap;
  word-wrap: normal;
  direction: ltr;
  -webkit-font-feature-settings: 'liga';
  -webkit-font-smoothing: antialiased;
}
[/code]

Nous téléchargeons aussi le fichier TTF et le mettons dans le dossier <b class="helvetica">www/fonts</b>.

[code lang="bash"]
mkdir -p fonts
wget https://fonts.gstatic.com/s/materialicons/v17/2fcrYFNaTjcS6g4U3t-Y5StnKWgpfO2iSkLzTz-AABg.ttf -O fonts/material_icons.ttf
[/code]

Comme vous pouvez le voir dans le fichier <b class="helvetica">index.html</b>, nous ajoutons un script nommé <b class="helvetica">js/main.js</b>: ce sera le code JavaScript généré par js_of_ocaml c'est-à-dire notre code OCaml compilé en JavaScript.

<h3>Maintenant, le meilleur moment: le code OCaml</h3>

Le plugin <b class="helvetica">cordova-plugin-sms</b> définit une fonction <b class="helvetica">Sms.send phonenumber message success_cb error_cb</b> pour envoyer un message. Le binding OCaml définit un module <b class="helvetica">Cordova_sms</b> et le binding à la fonction Sms.send qui est <b class="helvetica">send</b> et qui utilise des arguments avec label. Cette fonction peut être utilisé de la manière suivante:
[cce lang="ocaml"]
Cordova_sms.send ~num:phonenumber ~msg:message ~succ_cb:success_cb ~err_cb:~error_cb
[/cce]

Passons à la logique de l'application: l'utilisateur entre le numéro de téléphone auquel il veut envoyer le SMS dans l'input approprié ainsi que le message dans l'input du message. Quand l'utilisateur touche le bouton submit, nous récupérons le contenu de chaque input et appellons la fonction <b class="helvetica">Cordova_sms.send</b> avec les bons arguments.

Here the OCaml code:
[cce lang="ocaml"]

let on_device_ready () =
  let num_node = Jsoo_lib.get_input_by_id “num” in
  let msg_node = Jsoo_lib.get_input_by_id “msg” in
  let btn_node = Jsoo_lib.get_button_by_id “submit” in

  let succ () =
    Cordova_dialogs.alert “Message sent!” ~title:”It’s working!” ();
    num_node##.value := (Js.string “”);
    msg_node##.value := (Js.string “”)
  in
  let err msg =
    Cordova_dialogs.alert msg ~title:”Something wrong =(:” ()
   in

  btn_node##.onclick := Dom.handler
  (
    fun e -&gt;
      let num = Js.to_string (num_node##.value) in
      let msg = Js.to_string (msg_node##.value) in
      if num = “” then
        Cordova_dialogs.alert “Please enter a phone number.” ~title:”Missing field” ()
      else if msg = “” then
        Cordova_dialogs.alert “Please enter a message.” ~title:”Missing field” ()
      else
        Cordova_sms.send ~num:num ~msg:msg ~succ_cb:succ ~err_cb:err ();
    Js._false
  )

let _ = Cordova.Event.device_ready on_device_ready
[/cce]

Copiez et collez ce code dans un fichier nommé <b class="helvetica">test.ml</b>

<h3>Compiler le code OCaml en JavaScript</h3>

C'est le moment de compiler notre code en JavaScript. Pour cela, nous utilisons js_of_ocaml. Comme nous utilisons plusieurs package opam, nous allons utiliser <b class="helvetica">ocamlfind</b> et l'argument <b class="helvetica">-package</b> pour linker tous les packages. Js_of_ocaml a besoin d'un bytecode OCaml, donc la première chose à faire est de compiler notre code en bytecode. Ensuite, nous utilisons js_of_ocaml pour générer en sortie le fichier JavaScript <b class="helvetica">js/main.js</b>.

[code lang="bash"]
ocamlfind ocamlc -o test.byte -no-check-prims -package js_of_ocaml -package js_of_ocaml.ppx -package gen_js_api -package jsoo_lib -package cordova -package cordova-plugin-sms -package cordova-plugin-dialogs -linkpkg test.ml
js_of_ocaml -o js/main.js +gen_js_api/ojs_runtime.js test.byte
[/code]

<h3>Compiler l'application et l'exécuter</h3>

Maintenant nous pouvons compiler l'application. En fonction de la plateforme pour laquelle vous voulez compiler, vous utilisez (pour Android)

[code lang="bash"]
cordova build android
[/code]
ou (pour iOS)
[code lang="bash"]
cordova build ios
[/code]

Vous pouvez finalement exécuter l'application sur l'émulateur (ou sur votre smartphone si vous l'avez connecté) en utilisant (pour Android)

[code lang="bash"]
cordova run android
[/code]
ou (pour iOS)
[code lang="bash"]
cordova run ios
[/code]

<h2 class="text-center">Conclusion</h2>
J'espère que vous avez apprécié ce tutoriel et je vous invite à regarder plus en profondeur le dépot <a href="https://github.com/dannywillems/ocaml-cordova-plugin-list">ocaml-cordova-plugin-list</a> où vous pouvez accéder à la liste entière des bindings et à quelques exemples.

N'hésitez pas à star le projet et de donner un feedback !