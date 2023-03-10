---
layout: post
title: Fix -fPIC OCaml compilation error
date: 2024-03-10 17:26:38 +0200
author: Danny Willems
tags: [ocaml, fpic, dune]
---

When compiling C stubs, you may encounter the following issue

```
warning: relocation against `Caml_state' in read-only section `.text'
relocation R_X86_64_PC32 against undefined symbol `Caml_state' can not be used when making a shared object; recompile with -fPIC
```

Check if the default C flags of `ocamlopt` are given. In the field foreign_stubs, check if you give `:standard` as flags.
It will include the default flags given by `ocamlc -config`. For 4.14.1, the default values are:

```
$ ocamlc -config
[...]
ocamlc_cflags: -O2 -fno-strict-aliasing -fwrapv -pthread -fPIC
[...]
ocamlopt_cflags: -O2 -fno-strict-aliasing -fwrapv -pthread -fPIC
[...]
```

You can also simply add `-fPIC` in the c_flags, but it is better to follow the
standard flags included by the OCaml compiler.
