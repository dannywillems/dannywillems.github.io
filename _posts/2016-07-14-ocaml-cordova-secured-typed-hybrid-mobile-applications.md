---
ID: 392
title: >
  OCaml + Cordova = more secured, typed and hybrid mobile applications.
author: Danny Willems
post_date: 2016-07-14 16:27:35
post_excerpt: ""
layout: post
published: true
tags: [Mobile application, Cordova, OCaml, FP, RSS]
---

Since several months, I began to be interested in mobile development. I found a
job in Brussels in July 2015 where I learned how to develop hybrid mobile
applications (one code = available for multiple mobile platforms) with Cordova
and web technologies. I found it very interesting and after several month I
continue to develop applications with this technology. I discovered a very great
community about mobile development and some awesome frameworks like
<a href="http://ionicframework.com/">Ionic</a>.

The majority of these frameworks use JavaScript as programming language but I
don't really like this language because you have no types, some weird things
(equality between string and integer), parameters are sent as undefined if not
passed, etc. I don't really like to develop applications with JavaScript because
it's very ugly (even if I think it's OK for prototyping, but not in production).

I discovered OCaml at the university, a very powerful programming language with
inferred static type, type checking at compilation time, an extraordinary
community and... a compiler from OCaml to JavaScript! So, I wanted to use this
language to develop mobile applications with Cordova: it will be my university
project for a semester.

<p class="dw-quote">The goal of my project is to be able to use native components of smartphones such like accelerometer, camera, send sms, etc in OCaml.</p>

## What are Cordova, js_of_ocaml and gen_js_api?

- <a href="https://cordova.apache.org/">Cordova</a> allows you to develop hybrid
  mobile applications using web technologies such as HTML, CSS and JavaScript.
  For more information, see <a href="https://cordova.apache.org/">the official
  website</a>. Through Cordova plugins, you can access to the native components.
  To learn how to make Cordova plugins, see
  <a href="https://cordova.apache.org/docs/en/latest/guide/hybrid/plugins/index.html">the
  official tutorial</a>. You can find the official Cordova plugin list
  <a href="https://cordova.apache.org/plugins/">here.</a>
- <a href="https://ocsigen.org/js_of_ocaml">js_of_ocaml</a> provides a compiler
  from OCaml to JavaScript. Since Cordova applications use JavaScript,
  js_of_ocaml provides a way to develop mobile application using OCaml. For more
  info, see <a href="http://ocsigen.org/">the Ocsigen project</a> which contains
  js_of_ocaml
- <a href="https://github.com/lexifi/gen_js_api">gen_js_api</a> aims at
  simplifying the creation of OCaml bindings for JavaScript libraries. It must
  currently be used with the js_of_ocaml compiler, although other ways to run
  OCaml code "against" JavaScript might be supported later with the same binding
  definitions (for instance, Bucklescript, or direct embedding of a JS engine in
  a native OCaml application)

All bindings are developed with gen_js_api and aims to be functional, typed and
very close to the JavaScript interface.

## How can I use a binding?

<b>Needs compiler >= 4.03.0</b>

I created a GitHub listing all bindings:
<a href="https://github.com/dannywillems/ocaml-cordova-plugin-list">ocaml-cordova-plugin-list</a>.
Each binding is an opam package and so can be installed with opam. It is
recommended to add this repository as a remote opam package provider with

```bash
opam repository add cordova https://github.com/dannywillems/ocaml-cordova-plugin-list.git
```

Each binding can now be installed. For example, the binding to the camera plugin
is <b class="helvetica">cordova-plugin-camera</b>. So, if you want to install
the camera binding, you need to use

```bash
opam install cordova-plugin-camera
```

The appropriate opam package is given in the appropriate GitHub repository (list
is given
<a href="https://github.com/dannywillems/ocaml-cordova-plugin-list">here</a>).

If the plugin needs the binding to the standard js library such as
<b class="helvetica">device-motion</b>, you need to pin the
<a href="https://github.com/dannywillems/ocaml-js-stdlib">ocaml-js-stdlib</a>
first. If the plugin needs it, it is mentioned in the GitHub repository.

If you don't want to add this repository, you can manually pin each repository.

## What about documentation for each bindings?

Bindings interface are very close to initial plugins JavaScript interface. For
example, for the <b class="helvetica">cordova-plugin-camera</b> allowing you to
take a picture through <b class="helvetica">navigator.camera.getPicture</b>
JavaScript function, you use <b class="helvetica">Cordova_camera.get_picture</b>
OCaml function. The equivalent OCaml code to

```javascript
var success_callback = function(success) {
console.log(success);
}

var error_callback = function(error) {
console.log(error);
}

var options = {quality: 25; destinationType: Camera.DestinationType.DATA_URL}

navigator.camera.getPicture(success_callback, error_callback, options)
```

is

```ocaml
let success_callback success = Jsoo_lib.console_log success in

let error_callback error = Jsoo_lib.console_log error in

let options =
Cordova_camera.create_options
~quality:25
~destination_type:Cordova_camera.Data_url
()
in

Cordova_camera.get_picture success_callback error_callback ~opt:options ()
```

(supposing <b class="helvetica">Jsoo_lib.console_log</b> is the binding to
<b class="helvetica">console.log</b> function, see
<a href="https://github.com/dannywillems/jsoo-lib">jsoo_lib</a>). Most functions
are implemented with optional arguments and these arguments are at the end of
the arguments list, so unit is often mandatory.

As the OCaml interface is very close to JavaScript interface, no OCaml
documentation is done yet. Feel free to contribute.

Most of bindings have an example application showing you how to use it. Bindings
which don't have example application are not tested. Please give a feedback
about it and open issues if it's the case.

<p class="dw-quote">You can find more information about this project on <a href="https://github.com/dannywillems/ocaml-cordova-plugin-list">ocaml-cordova-plugin-list</a> GitHub repository.</p>

## Be careful: device_ready event

Most of plugins create new objects which are only available when the
<b class="helvetica">deviceready</b> event fires. You need to have as first
lines:

```ocaml
let on_device_ready () =
(* Your code using plugins here *)

let _ = Cordova.Event.device_ready on_device_ready
```

The module <b class="helvetica">Cordova</b> comes from the binding to the
<b class="helvetica">cordova</b> object so you need to add it for each project.
This module can be installed with

```bash
opam install cordova
```

## Could you give an entire example please?

Of course. I will show you how to write a hybrid application allowing you to
send a SMS to someone. If we succeed to send the SMS, a dialog appears saying
everything is OK, else a dialog shows an error message. You can find all the
code in
<a href="https://github.com/dannywillems/ocaml-cordova-plugin-sms-example">this
repository</a>

<a href="http://blog.danny-willems.be/wp-content/uploads/2016/07/Selection_002.png"><img src="http://blog.danny-willems.be/wp-content/uploads/2016/07/Selection_002-170x300.png" alt="ocaml-cordova-plugin-sms-example" width="170" height="300" class="size-medium wp-image-410"></a>

Other examples can be found
<a href="https://github.com/dannywillems/ocaml-cordova-plugin-list">here</a>.
Here some other screenshots.

<a href="http://blog.danny-willems.be/wp-content/uploads/2016/07/screenshot_android.png"><img src="http://blog.danny-willems.be/wp-content/uploads/2016/07/screenshot_android-167x300.png" alt="ocaml-cordova-plugin-toast-example-android" width="167" height="300" class="size-medium wp-image-415"></a>

<a href="http://blog.danny-willems.be/wp-content/uploads/2016/07/screenshot_ios.png"><img src="http://blog.danny-willems.be/wp-content/uploads/2016/07/screenshot_ios-166x300.png" alt="ocaml-cordova-plugin-toast-example-ios" width="166" height="300" class="size-medium wp-image-414"></a>

### Set up the development environment

First thing to do is to set up the development environment. What we need is:

- <b class="helvetica">Cordova</b> distributed as a NodeJS package. To install
  NodeJS, I recommend to use
  <a href="https://github.com/creationix/nvm">nvm</a>. Read the GitHub
  instructions to install nvm and a NodeJS version. After that, install globally
  Cordova with

```bash
npm install -g cordova
```

- <b class="helvetica">OCaml 4.03.0 and opam</b>. See
  <a href="https://ocaml.org">ocaml.org</a> to install OCaml and opam for your
  distribution. After that, install OCaml 4.03.0 by using

```bash
opam switch 4.03.0
```

Now we have a basic development environment. We will install all Cordova plugins
we need and all opam package (included bindings to Cordova plugins).

### Create the Cordova project and install the needed plugins

Create a Cordova project by using

```bash
cordova create ocaml-cordova-plugin-sms-example
```

A basic Cordova project is created in the
<b class="helvetica">ocaml-cordova-plugin-sms-example</b> directory. Go in this
directory with

```bash
cd ocaml-cordova-plugin-sms-example
```

In this directory, you find a <b class="helvetica">www</b> directory which will
be included in the final package you will install on the smartphone. It works
<b>exactly</b> like a website. It contains a <b class="helvetica">index.html</b>
file which is the first executed file (Cordova uses a WebView in which web files
are executed, like a standard website).

We have to add the platform we need to build for. If you want to build for iOS
(you need Mac OS X with XCode installed), use

```bash
cordova platform add ios
```

If you want to build for Android, you need to install
<a href="https://developer.android.com/studio/index.html">the Android SDK</a>.
See
<a href="https://cordova.apache.org/docs/fr/latest/guide/platforms/android/">the
official documentation</a> for the entire installation process. To add the
Android platform to the Cordova project, use

```bash
cordova platform add android
```

<p class="dw-quote">I don't give the example for Windows/Windows Phone because it's very hard to install natively OCaml on Windows and you need to be on Windows to build for Windows/Windows Phone. However, with <a href="http://www.howtogeek.com/249966/how-to-install-and-use-the-linux-bash-shell-on-windows-10/">Bash on Windows</a> eveything is working like on a common Linux Distrbution.</p>
Now we install plugins. For this example, we will used two plugins: <a href="https://github.com/cordova-sms/cordova-sms-plugin">cordova-plugin-sms</a> to send the message and <a href="https://github.com/apache/cordova-plugin-dialogs">cordova-plugin-dialogs</a> to show a dialog. We can install with these commands:

```bash
cordova plugin add cordova-plugin-sms
cordova plugin add cordova-plugin-dialogs
```

### OCaml and opam packages

We need <b class="helvetica">js_of_ocaml</b> (to compile our source file in
JavaScript) and <b class="helvetica">gen_js_api</b> (to compile the bindings).
We install it with opam with

```bash
opam install js_of_ocaml gen_js_api
```

After that, we add the opam package provider listing all bindings OCaml to the
Cordova plugins available.

```bash
opam repository add cordova https://github.com/dannywillems/ocaml-cordova-plugin-list.git
```

As described in the repository, the bindings to
<b class="helvetica">cordova-plugin-sms</b> and
<b class="helvetica">cordova-plugin-dialogs</b> are available in the opam
package <b class="helvetica">cordova-plugin-sms</b> and
<b class="helvetica">cordova-plugin-dialogs</b>. So we use:

```bash
opam install cordova-plugin-sms cordova-plugin-dialogs
```

Due to the <b class="helvetica">deviceready</b> event, we need the binding to
the Cordova object (as said in GitHub repository). We install it with

```bash
opam install cordova
```

I will also use some functions coming from
<a href="https://github.com/dannywillems/jsoo-lib">jsoo_lib</a>, a small library
I write with bindings to standard JavaScript functions. You need to pin it and
install it with opam

```bash
opam pin add jsoo_lib https://github.com/dannywillems/jsoo-lib.git
```

And now we have finished with the set up development environment. Go into code!

### index.html and design

We use <a href="http://materializecss.com/">materializecss</a> as a CSS
framework. We move in the www directory and we use npm to install it:

```bash
cd www &amp;&amp; npm install materialize-css
```

For the design, we need two inputs and a button to send the message. We replace
the current <b class="helvetica">index.html</b> content with this following:

```html
<!DOCTYPE html>
<html>
  <head>
    <meta
      http-equiv="Content-Security-Policy"
      content="default-src 'self' data: gap: https://ssl.gstatic.com 'unsafe-eval'; style-src 'self' 'unsafe-inline'; media-src *"
    />
    <meta name="format-detection" content="telephone=no" />
    <meta name="msapplication-tap-highlight" content="no" />
    <meta
      name="viewport"
      content="user-scalable=no, initial-scale=1, maximum-scale=1, minimum-scale=1, width=device-width"
    />
    <link rel="stylesheet" type="text/css" href="css/index.css" />
    <!-- CSS setup for materialize -->
    <link
      rel="stylesheet"
      type="text/css"
      href="node_modules/materialize-css/dist/css/materialize.min.css"
    />
    <script type="text/javascript" src="cordova.js"></script>
    <script type="text/javascript" src="js/main.js"></script>
    <title>OCaml Cordova Plugin: Sms</title>
  </head>
  <body>
    <script
      type="text/javascript"
      src="node_modules/jquery/dist/jquery.min.js"
    ></script>
    <script
      type="text/javascript"
      src="node_modules/materialize-css/dist/js/materialize.js"
    ></script>
    <div class="row">
      <form class="col s12">
        <div class="row">
          <div class="input-field col s12">
            <input id="num" type="tel" class="validate" />
            <label for="num">Phone number</label>
          </div>
          <div class="input-field col s12">
            <input id="msg" type="text" class="validate" />
            <label for="msg">Your message</label>
          </div>
          <div class="input-field col s12 center">
            <button
              class="btn waves-effect waves-light"
              id="submit"
              type="submit"
              name="action"
            >
              Send<i class="material-icons right">send</i>
            </button>
          </div>
        </div>
      </form>
    </div>
  </body>
</html>
```

To have the Material Icons, we need to write a CSS file. We also add a
padding-top. Remove the entire content
of&nbsp;<b class="helvetica">css/index.css</b>&nbsp;and insert the following
code

```css
body {
  padding-top: 25px;
}

/* fallback */

@font-face {
  font-family: "Material Icons";
  font-style: normal;
  font-weight: 400;
  src:
    local("Material Icons"),
    local("MaterialIcons-Regular"),
    url(../fonts/material_icons.ttf) format("ttf");
}

.material-icons {
  font-family: "Material Icons";
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
  -webkit-font-feature-settings: "liga";
  -webkit-font-smoothing: antialiased;
}
```

We also download the ttf file and put in <b class="helvetica">www/fonts</b>
directory.

```bash
mkdir -p fonts
wget https://fonts.gstatic.com/s/materialicons/v17/2fcrYFNaTjcS6g4U3t-Y5StnKWgpfO2iSkLzTz-AABg.ttf -O fonts/material_icons.ttf
```

As you can see in the <b class="helvetica">index.html</b>, we add a script named
<b class="helvetica">js/main.js</b>: it will be the JavaScript code generated by
js_of_ocaml ie our OCaml code compiled in JavaScript.

### Now the best moment, the OCaml code!

The plugin <b class="helvetica">cordova-plugin-sms</b> defines a function
<b class="helvetica">Sms.send phonenumber message success_cb error_cb</b> to
send a message. The OCaml binding defines a module
<b class="helvetica">Cordova_sms</b> and the binding to the Sms.send function
<b class="helvetica">send</b> which uses labeled arguments and can be used in
this way

```ocaml
Cordova_sms.send ~num:phonenumber ~msg:message ~succ_cb:success_cb ~err_cb:~error_cb
```

Here the logic: the user writes the phonenumber he wants to send the SMS to in
the phonenumber input and the SMS content in the message input. When he touched
the submit button, we get the contents of these input and call the function
<b class="helvetica">Cordova_sms.send</b> with the right arguments.

Here the OCaml code:

```ocaml
let on_device_ready () =
let num_node = Jsoo_lib.get_input_by_id "num" in
let msg_node = Jsoo_lib.get_input_by_id "msg" in
let btn_node = Jsoo_lib.get_button_by_id "submit" in

let succ () =
Cordova_dialogs.alert "Message sent!" ~title:"It’s working!" ();
num_node##.value := (Js.string "");
msg_node##.value := (Js.string "")
in
let err msg =
Cordova_dialogs.alert msg ~title:"Something wrong =(:" ()
in

btn_node##.onclick := Dom.handler
(
fun e ->
let num = Js.to_string (num_node##.value) in
let msg = Js.to_string (msg_node##.value) in
if num = "" then
Cordova_dialogs.alert "Please enter a phone number." ~title:"Missing field" ()
else if msg = "" then
Cordova_dialogs.alert "Please enter a message." ~title:"Missing field" ()
else
Cordova_sms.send ~num:num ~msg:msg ~succ_cb:succ ~err_cb:err ();
Js._false
)

let _ = Cordova.Event.device_ready on_device_ready
```

Copy and paste this code in a file named <b class="helvetica">test.ml</b>

### Compile the OCaml code in JavaScript

It's time to compile our code in JavaScript. For that, we use js_of_ocaml. As we
use some opam package, we will use <b class="helvetica">ocamlfind</b> and the
<b class="helvetica">-package</b> argument to link all packages. Js_of_ocaml
needs an OCaml bytecode, so first we compile the code in bytecode. Second, we
use js_of_ocaml and output the JavaScript in
<b class="helvetica">js/main.js</b>.

```bash
ocamlfind ocamlc
  -o test.byte \
  -no-check-prims \
  -package js_of_ocaml \
  -package js_of_ocaml.ppx \
  -package gen_js_api \
  -package jsoo_lib \
  -package cordova \
  -package cordova-plugin-sms \
  -package cordova-plugin-dialogs \
  -linkpkg test.ml
js_of_ocaml -o js/main.js +gen_js_api/ojs_runtime.js test.byte
```

### Build the resulting application and run it

Now we can build the application. Depending on the platform you want to build
for, you use (for Android)

```bash
cordova build android
```

or (for iOS)

```bash
cordova build ios
```

You can finally run the application on the emulator (or on your smartphone if
you connected it) by using (for Android)

```bash
cordova run android
```

or (for iOS)

```bash
cordova run ios
```

## Conclusion

I hope you liked this tutorial and I invite you to take a deeper look at the
<a href="https://github.com/dannywillems/ocaml-cordova-plugin-list">ocaml-cordova-plugin-list</a>
repository. You have the entire list of bindings and some examples.

Don't hesitate to star the project and give a feedback!
