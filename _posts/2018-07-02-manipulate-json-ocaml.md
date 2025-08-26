---
ID: 535
title: How to manipulate JSON in OCaml?
author: Danny Willems
post_date: 2018-07-02 23:13:06
post_excerpt: ""
layout: post
published: true
tags: [OCaml, JSON, PPX, RSS]
---

Use <a href="https://github.com/ocaml-ppx/ppx_deriving_yojson">PPX Deriving
JSON</a>. PPX is a syntax extension and PPX Deriving JSON derives functions when
annotating a type to convert from and to JSON.

```ocaml
type person = {
  name: string;
  age: int;
} [@@deriving yojson]
```

will generate the functions

```ocaml
type person = { name : string; age : int; }
val person_to_yojson : person -> Yojson.Safe.json = <fun>
val person_of_yojson : Yojson.Safe.json -> person Ppx_deriving_yojson_runtime.error_or = <fun>
```

You can then play with the converters like this:

```ocaml
let x : person = {name = "hello"; age = 15};;
(* val x : person = {name = "hello"; age = 15} *)
person_to_yojson x;;
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

> If the type is called `t`, the functions are `to_json` and `of_json`
