---
ID: 535
title: How to manipulate JSON in OCaml?
author: Danny Willems
post_date: 2018-07-02 23:13:06
post_excerpt: ""
layout: post
published: true
tags: [OCaml, JSON, PPX]
---
Use <a href="https://github.com/ocaml-ppx/ppx_deriving_yojson">PPX Deriving JSON</a>. PPX is a syntax extension and PPX Deriving JSON derives functions when annotating a type to convert from and to JSON.

```ocaml
type t = {
  name: string;
  age: int;
} [@@deriving yojson]
```
will generate the functions
```ocaml
type t = { name : string; age : int; }
val to_yojson : t -> Yojson.Safe.json = <fun>
val of_yojson : Yojson.Safe.json -> t Ppx_deriving_yojson_runtime.error_or = <fun>
```
You can then play with the converters like this:
```ocaml
let x : t = {name = "hello"; age = 15};;
(* val x : t = {name = "hello"; age = 15} *)
to_yojson x;;
(* - : Yojson.Safe.json = `Assoc [("name", `String "hello"); ("age", `Int 15)] *)
```

If you use dune, you've got to use this
```
(library
 ((name test)
  (public_name test)
  (modules (test))
  (libraries (yojson ppx_deriving ppx_deriving.runtime
              ppx_deriving_yojson.runtime))
  (preprocess (pps (ppx_deriving ppx_deriving_yojson)))
))
```
