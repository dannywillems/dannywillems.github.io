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
computations that would be expensive to constrain otherwise. In other terms,
lookup arguments are used for relations of high algebraic complexities.

## MVLookup

MVLookup are described in https://eprint.iacr.org/2022/1530.pdf.
It is based on the sumcheck protocol.

The terms to remember in the paper:
- cached quotients -> we use some pre-computed quotients to speed up some computations
- batch column lookups -> on the same row, multiple columns query the same table.
- the main change in MVLookup is to use the mathetical objects called `rational functions`. Rational functions are well-defined mathematical objects, which are fractions of polynomials, i.e. $\frac{P(X)}{Q(X)}$.
- the notion of the `logarithm derivative` of a polynomial $P(X)$, defined as the rational function $\frac{P'(X)}{P(X)}$. We will use the term **logup** to talk about the logarithmic derivative of a polynomial $P(X)$, and we will use the notation $logup(P(X))$
- a property used in the lookup argument is the following. If a polynomial
  $P(X)$ can be decomposed in $\prod_{i = 1}^{n} (X + z_{i}$, then $logup(P(X))
  = \sum_{i = 1}^{n} \frac{1}{X + z_{i}}$.

### Homomorphic commitments

Useful to prove *simultaneously* (i.e with a single query) that $a_{i}$ and
$b_{i}$ are in $T_{1}$ and $T_{2}$ by proving that $a_{i} + r b_{i}$ is in
$T_{1} + r T_{2}$. We save one query. This is called a *vector lookup*. Example:
baloo and Caulk

### Vocabulary

- query: request to prove that a value is in the table.

### Questions

Let $\mathbb{V} < G$ and $\mathbb{H} < G$, with $\|V\| = N$ and $\|H\| = n$, with $n < N$.
Our table is the evaluations of a polynomial $T: V \rightarrow K$, and the value
we look up are evaluations of a function $f: H \rightarrow G$.
Can we have some nice properties if $f$ is a morphism?
