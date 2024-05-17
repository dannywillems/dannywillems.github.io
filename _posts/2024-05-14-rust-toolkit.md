---
layout: post
title: Opiniated good Rust engineering practices
date: 2024-05-10 10:02:36 +0000
author: Danny Willems
tags: [engineering, rust, software]
---

In the series "Engineering", I continue with some notes regarding my opinion on good Rust engineering practices. It follows:
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
