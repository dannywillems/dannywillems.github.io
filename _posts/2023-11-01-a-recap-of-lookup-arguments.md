---
layout: post
title: A recap of lookup arguments
date: 2023-10-31 00:02:36 +0000
author: Danny Willems
tags: [SNARK, lookup, arguments]
---

This is only a draft, and at the moment, it will be simply a list of papers to
recap the different existing lookup arguments. I try to keep it in the order of
publication.

- https://sci-hub.ru/10.1007/bf01185212
- https://eprint.iacr.org/2023/1555.pdf - Permem and gcq
- Nearly Linear-Time Zero-Knowledge Proofs for Correct Program Execution: https://eprint.iacr.org/2018/380
- Plookup: https://eprint.iacr.org/2020/315.pdf
- HyperPlonk: https://eprint.iacr.org/2022/1355
- MVLookup: https://github.com/Orbis-Tertius/MVlookups/blob/main/MVlookup.pdf
  - some interesting proofs about lookup derivative. Easy to read the lemmas, well-explained.
- cq: https://eprint.iacr.org/2022/1763


## Introduction

A lookup argument is an argument to prove that the values of a commited
polynomial $P(X) \in \mathbb{K}^{<n}[X]$ is contained in a table $t \in
\mathbb{K}^N$, where $t$ is a precomputed table of values. It is used to avoid
computations that would be expensive to constrain otherwise.
