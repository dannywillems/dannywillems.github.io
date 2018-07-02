---
ID: 535
post_title: How to manipulate JSON in OCaml?
author: Danny Willems
post_date: 2018-07-02 23:13:06
post_excerpt: ""
layout: post
permalink: >
  https://blog.danny-willems.be/en/manipulate-json-ocaml/
published: true
---
Use <a href="https://github.com/ocaml-ppx/ppx_deriving_yojson">PPX Deriving JSON</a>. PPX is a syntax extension and PPX Deriving JSON derives functions when annotating a type to convert from and to JSON.

[cce lang="ocaml"]
type t = {
  name: string;
  age: int;
} [@@deriving yojson]
[/cce]

[cce lang="ocaml"]
(library
 ((name test)
  (public_name test)
  (modules (test))
  (libraries (yojson ppx_deriving ppx_deriving.runtime
              ppx_deriving_yojson.runtime))
  (preprocess (pps (ppx_deriving ppx_deriving_yojson)))
))
[/cce]