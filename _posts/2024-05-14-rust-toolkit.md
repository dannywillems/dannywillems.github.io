---
layout: post
title: Opiniated good Rust engineering practices
date: 2024-05-10 10:02:36 +0000
author: Danny Willems
tags: [engineering, rust, software]
---

In the series "Engineering", I continue with some notes regarding my opinion on
good Rust engineering practices. It follows:

- [Cryptography/R&D engineering practices](https://dannywillems.github.io/2024/05/16/engineering-practices-again.html)
- [The Rekt test, revisited](https://dannywillems.github.io/2024/01/20/the-rekt-test-revisited.html)
- [You said bugs? Key points I have learned over the years in FOSS development.](https://dannywillems.github.io/2023/12/08/you-said-bugs.html)

Interesting links:

- Idiomatic Rust: https://github.com/mre/idiomatic-rust
- Rust lang cheat sheet: https://cheats.rs/

## Memory layout good practices

Having a good memory layout for your structures is important. For instance, if
all of your data is layered properly in a linear memory and can fit into a page,
the CPU won't need to fetch multiple times the RAM which can be costly, and the
computation will be performed on data that are kept in the CPU chip.

A good video regarding the memory layout in Rust is available
[here](https://www.youtube.com/watch?v=7_o-YRxf_cc).

## Lifetimes

Rust embeds in the type the memory layout when dealing with addresses, and add a
new type describing the scope the value will live in. A good initial reference
to understand lifetimes is
[Oxide: the essence of Rust](https://arxiv.org/pdf/1903.00982). The paper
describes that they developed a type system to describe "region-based alias
management". The formalisation of a Rust-like programming language requires to
be able to describe "alias" ("pointers") to some "region" ("values") in memory.

By that, I mean that if you have a value of type `S`, a reference `&'a S` can be
seen as a description (the reference "&") of a certain piece of information
structured as "S" that will live for `'a`. If we take an analogy with physics
and spacetime, the type "reference to the structure S" can be seen as a
description of the value that lives in the dimension "space" and the type `'a`
can be seen as a description of the region in the dimension "time". The "time"
can be seen as a linear space. Each value has a default "time" type to describe
the part of the program it will live in. The lifetime is simply an additional
information describing the value, and help to reason about it. For instance, if
you have a lambda term `λy ((λx t) y)`, you want to type the fact that x "lives
only inside the expression `λx t`.

The lifetime types describe only a way to detect at compile time "time access
management bugs". At runtime, Rust will take care, with a "specialised
allocator", to free/allocate the values into the real-world.

I am curious what is the link with logics, and what is the link with a
propositions that "live only for the lifetime 'a".
