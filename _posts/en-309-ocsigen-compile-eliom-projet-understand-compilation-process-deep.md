---
ID: 309
post_title: 'Ocsigen: how to compile an Eliom project. Understand the compilation process in deep.'
author: Danny Willems
post_date: 2016-07-14 00:38:14
post_excerpt: ""
layout: post
permalink: >
  http://blog.danny-willems.be/en/ocsigen-compile-eliom-projet-understand-compilation-process-deep/
published: true
---
It's time to write my first article on <a href="http//ocsigen.org">Ocsigen</a> and especially on <a href="http://ocsigen.org/eliom">Eliom</a>. I began a week ago my internship in <a href="https://besport.com">BeSport</a>, a social network centralized on sports and entirely developed in OCaml using the Ocsigen projects so I needed to learn how Ocsigen works in general.

<h2 class="text-center">Ocsigen? What's that? It's an atom no?</h2>
Yes, oxygen is a chemical element but Ocsigen is also an OCaml web framework began in 2004.

<h2 class="text-center">Wait, another web framework? There are plenty of existing web frameworks.</h2>

Yeah, I agree. But Ocsigen is different in some cases. First, Ocsigen is entirely written in OCaml: no PHP, no JavaScript, no HTML. Second, Ocsigen contains independent «small» projects which, together, form a very elegant framework. Here some of these sub-projects:
<ul>
  <li><a href="http://ocsigen.org/ocsigenserver">Ocsigenserver</a>: web server entirely written in OCaml. It supports HTTPS, multiple hosts (virtual hosts), proxy, content compression, access control, authentication, etc. Everything you need is implemented and very easy to configure. Ocsigenserver allows you to develop modules to add functionalities to the server.</li>
  <li><a href="http://ocsigen.org/js_of_ocaml/">Js_of_ocaml</a>: a compiler OCaml bytecode to JavaScript. It allows you to write OCaml program and to compile it in JavaScript so you can write web application entirely in OCaml.</li>
  <li><a href="http://ocsigen.org/eliom">Eliom</a>: a high level library to build client side and server side applications. In few lines of code and in the same file, you can write complex websites and the server side associated. It uses the strong OCaml type system to create route, html pages, data exchange, session mechanisms, etc. It uses new concepts in web programming which are very interesting and are up-to-date with modern needed.</li>
  <li><a href="http://ocsigen.org/lwt">Lwt</a>: cooperative programming in OCaml. It's popular in the OCaml community even in non-web project.</li>
  <li><a href="http://ocsigen.org/tyxml">TyXML</a>: write typed XML tree (in particular HTML). 
  <li>and more... You can find all Ocsigen sub-projects <a href="http://ocsigen.org">here</a></li>
</ul>

<div class="text-center"><!--more--></div>

<h2 class="text-center">Oh great! Can you show me an example?</h2>

Yes, of course. I will show a basic Eliom project and how to compile it. In other articles, I will give js_of_ocaml, ocsigenserver and lwt examples. The main goal of this article is to show you the entire process to build an Eliom project, from code to compilation by configuring the ocsigenserver.

<div class="dw-quote">This article doesn't explain how Eliom works and all Eliom modules in details. It's just a step by step explanation of the compilation process. Other articles are coming for these purpose.</div>

<h2 class="text-center">How to install Eliom?</h2>

First, switch to a stable 4.02.3 OCaml compiler with
[code lang="bash"]
opam switch 4.02.3
[/code]
or if you want to give a name to the compiler, use
[code lang="bash"]
opam switch eliom-build-test --alias-of 4.02.3
[/code]
In this way, dependencies are the same for you and me.

The simplest way to install Eliom is to use <a href="https://opam.ocaml.org">OPAM</a>:
[code lang="bash"]
opam install eliom
[/code]

It will install all dependencies such like lwt, js_of_ocaml, ocsigenserver and the last Eliom version (which is currently 5.0). For the dev version (ie by using opam pin to the <a href="https://github.com/ocsigen/eliom">Github repository</a>), you need to pin the dev version of <a href="https://github.com/ocsigen/ocsigensever">ocsigenserver</a>.

<h2 class="text-center">The build tools</h2>

Eliom opam package comes with some tools (binary) you can use to build Eliom projects easier. Most of them are wrappers to common OCaml build tools:
<ul>
  <li><b class="helvetica">eliomc</b>: wrapper to ocamlc for Eliom project</li>
  <li><b class="helvetica">eliomopt</b>: wrapper to ocamlopt for Eliom project</li>
  <li><b class="helvetica">js_of_eliom</b>: wrapper to js_of_ocaml for Eliom project</li>
  <li><b class="helvetica">eliom-distillery</b>: provides templates for Eliom projects</li>
</ul>

<b class="helvetica">eliomc</b> compiles to bytecode and <b class="helvetica">eliomopt</b> to native code. For the rest of this article, we will use <b class="helvetica">eliomc</b>

<h2 class="text-center">Small Eliom code</h2>

An Eliom project uses files with extension <b class="helvetica">.eliom</b> and <b class="helvetica">.eliomi</b> (for interface). These filetypes are OCaml common filetypes (ml and mli) and contains OCaml code. It's just a way to distinguish between common OCaml code and Eliom code (Eliom build tools use these differences for some compilation rules).

This is a code example which defines a website and a page containing a paragraph with «Hello, World!». Paste it in a file <b class="helvetica">hello_world.eliom</b>. We will use this filename for the rest of the article.

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

Eliom works in term of <b class="helvetica">services</b> and not in term of page or url. The service is defined by
[cce lang="ocaml"]
let main_service =
  Eliom_registration.Html5.register_service
    ~path:[]
    ~get_params:Eliom_parameter.unit
    (* content *)
[/cce]
This service (<b class="helvetica">main_service</b>) returns an HTML5 page (because we use the module <b class="helvetica">Eliom_registration.Html5</b>) which has as a content <b class="helvetica">content</b>. The function <b class="helvetica">content</b> defines a <b class="helvetica">typed</b> HTML5 page: <b class="helvetica">head</b>, <b class="helvetica">body</b>, <b class="helvetica">title</b>, <b class="helvetica">pcdata</b> and <b class="helvetica">p</b> are functions defined in the module <b class="helvetica">Eliom_content.Html5.D</b>.

You can find more information about services and Eliom in the <a href="http://ocsigen.org/tuto/manual/">official Ocsigen tutorials</a>.

<h2 class="text-center">Extract the client and server types information</h2>

Even if we don't have client side code in this example, as I said, Eliom allows you to write the client and service side codes of your web applications in only one file. More information available <a href="http://ocsigen.org/tuto/5.0/manual/intro">here</a>.

The first step to compile an Eliom project is to extract client and server type information. <b class="helvetica">eliomc</b> has an option (<b class="helvetica">-infer</b>) to extract these information.
<b class="helvetica">eliomc</b> copies all compiled files in a directory called <b class="helvetica">_server</b>. This directory can be changed by modifying the variable <b class="helvetica">ELIOM_SERVER_DIR</b>. It's the
same thing for the client side code which are compiled in <b class="helvetica">_client</b> directory. This directory could be changed by modifying the variable <b class="helvetica">ELIOM_CLIENT_DIR</b>.

In this tutorial, we use the PPX syntax (<b class="helvetica">[%%shared (* code *)]</b> is an example of the PPX extension) so we need to add <b class="helvetica">-ppx</b> to each call to <b class="helvetica">eliomc</b>, <b class="helvetica">eliomopt</b> and <b class="helvetica">js_of_eliom</b>.

Extract type information with
[code lang="bash"]
eliomc -ppx -infer hello_world.eliom
[/code]

<h2 class="text-center">Compile server side code</h2>

Now we are able to compile the server side code in bytecode. This server side code must be compiled as a library for <b class="helvetica">Ocsigenserver</b>.
[code lang="bash"]
eliomc -ppx -c hello_world.eliom # compile in bytecode
eliomc -ppx -a -o hello_world.cma _server/hello_world.cmo # build a library for ocsigenserver
[/code]

<h2 class="text-center">Compile client side code</h2>

Client side code are essentially JavaScript code got from OCaml and compiled with js_of_ocaml. We use <b class="helvetica">js_of_eliom</b> to get client side code. We need the client side bytecode and use the resulting bytecode with <b class="helvetica">js_of_eliom</b> (same process with <b class="helvetica">js_of_ocaml</b>) to obtain the corresponding JavaScript. <b class="helvetica">js_of_eliom</b> extracts the client side of the Eliom file and compiles it in JavaScript. The corresponding cmo file is copied in <b class="helvetica">_client</b> directory.

[code lang="bash"]
js_of_eliom -ppx -c hello_world.eliom # get bytecode
js_of_eliom -ppx -o hello_world.js _client/hello_world.cmo # compile in JavaScript
[/code]

<h2 class="text-center">Ocsigenserver configuration</h2>

Now we have all compiled files we need for <b class="helvetica">ocsigenserver</b>: the <b class="helvetica">hello_world.cma</b> library which will be loaded in <b class="helvetica">ocsigenserver</b> and the client side code <b class="helvetica">hello_world.js</b>. The last thing is to configure the server.

<b class="helvetica">Ocsigenserver</b> has an interesting feature: you can locally run the server on a port &gt; 1024 and the only thing you need to give is a configuration file which is an XML file. All information can be found <a href="http://ocsigen.org/ocsigenserver/2.7/manual/">here</a>. I don't describe each line because it's not the goal of this article.

If you have already configured a HTTP server like Apache, you know the main directories are:
<ul>
  <li><b class="helvetica">/var/www/html</b>: contains all sites in a sub-directory</li>
  <li><b class="helvetica">/etc</b>: contains the configuration file, often in a sub-directory with the site name.</li>
  <li><b class="helvetica">/lib</b> library files.
  <li><b class="helvetica">/var/log</b>: contains all log files. We often create a sub-directory for all sites registered in /var/www/html where we put the log files.</li>
  <li><b class="helvetica">/var/data</b>: contains all data. Often, a sub-directory for each website.</li>
  <li><b class="helvetica">/var/run</b>: contains the run-time variable.</li>
</ul>

We use the same hierarchy for a local configuration of <b class="helvetica">ocsigenserver</b> except than all these directories will be created in a local directory called <b class="helvetica">local</b>. Our site will be named <b class="helvetica">hello_world</b> so we create a sub-directory in each directory. We add a sub-directory to <b class="helvetica">local/var/www/hello_world</b> called <b class="helvetica">eliom</b> to put in compiled Eliom client file ie <b class="helvetica">hello_world.js</b>: it gives the possibility to distinguish with other JavaScript or CSS files (called static).
[code lang="bash"]
mkdir -p local/var/www/html/hello_world # Site files
mkdir -p local/var/www/html/hello_world/eliom # Eliom files
mkdir -p local/etc/hello_world # Configuration files
mkdir -p local/lib/hello_world # Library file ie cma file.
mkdir -p local/var/log/hello_world # Log
mkdir -p local/var/data/hello_world # Data
mkdir -p local/var/run # Pipe to send command to ocsigenserver.
[/code]

I give a simple <b class="helvetica">ocsigenserver</b> configuration file:
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

Save this content in a file named <b class="helvetica">hello_world.conf</b>

The tags are explicit so I don't explain it. You can find all significations <a href="http://ocsigen.org/ocsigenserver/2.7/manual/config">in the official documentation.</a>.

The last thing to do is to copy all our files in the corresponding local <b class="helvetica">ocsigenserver</b> configuration i.e. in the proper sub-directory of the <b class="helvetica">local</b> directory.

[code lang="bash"]
cp hello_world.cma local/lib/hello_world
cp hello_world.js local/var/www/html/hello_world/eliom
cp hello_world.conf local/etc/hello_world
[/code]

<h2 class="text-center">Launch ocsigenserver</h2>

Now we have a full ocsigenserver configuration and a Eliom website build from scratch with tools given by the Ocsigen team.
To run the ocsigenserver with the previous configuration, use
[code lang="bash"]
ocsigenserver -c local/etc/hello_world/hello_world.conf
[/code]

and go to <a href="http://localhost:8080">http://localhost:8080</a>: you have a «Hello, World!» web application entirely written in OCaml!