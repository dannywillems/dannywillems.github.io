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

In terms of polynomials, a lookup argument aims to prove that the evaluations
over a group $H$ of a polynomial $P(X)$ are equals to the evaluations of another
polynomial $T$. If $H = <\omega^{i}>$, then the prover must convince that for each $\omega^{j}$,
$P(\omega^{j}) = T(\omega^{k})$, for a certain $k$. $P(X)$ is part of the
witness, where $T$ is public. You can note that with this notation, if $P$ and
$T$ are of the same degree, a lookup argument is exactly proving that the evaluations of $P$ is a
permutation of the evaluations of $T$, i.e. it is a permutation argument. That
explains the statement that a permutation argument is a lookup argument.

An important note is that $P$ and $T$ can be the same polynomials. In the case
of memory access, the same polynomials can be used to show which read/write
operations, and with which values, the execution trace performs at each row. In the case of
R/W operations, the order of the access must also be performed, it can be done
by keeping track of the last time the values has been read/written and verify
that the difference with the current instruction counter is in a predefined range.

Let's take an example. Let's the difference with the current instruction counters
are of size $16 = 2^4$, i.e. we have an execution trace of 16 operations (very small program).
The program fetches the memory at the instruction counter $IC$ 10. By checking
that $16 - 10$ is in the range $0, ..., 16$ and by keeping a column (i.e. a
polynomial) that will contain the current instruction counter for the last
fetch, we will keep track of the memory access at the instruction $10$, and that
it happened during the execution of the program. If we later fetch the same
address (e.g. instruction counter = $12$), we prove the property that it is after
the next instruction by checking that the difference with it is still in the
range $0, ..., 16$, i.e. that $12 - 10$ is in the range. If the prover lies, and
try to have the value before the instruction 10, the difference will be outside
of the range if we suppoes the field is at least twice larger than the table
size.


## MVLookup

MVLookup are described in https://eprint.iacr.org/2022/1530.pdf.
It is based on the sumcheck protocol.

What to remember from the paper:
- cached quotients -> we use some pre-computed quotients to speed up some computations
- batch column lookups -> on the same row, multiple columns query the same table.
- the main change in MVLookup is to use the mathetical objects called `rational functions`. Rational functions are well-defined mathematical objects, which are fractions of polynomials, i.e. $\frac{P(X)}{Q(X)}$.
- the notion of the `logarithm derivative` of a polynomial $P(X)$, defined as the rational function $\frac{P'(X)}{P(X)}$. We will use the term **logup** to talk about the logarithmic derivative of a polynomial $P(X)$, and we will use the notation $logup(P(X))$
- a property used in the lookup argument is the following. If a polynomial
  $P(X)$ can be decomposed in $\prod_{i = 1}^{n} (X + z_{i})$, then $logup(P(X))
  = \sum_{i = 1}^{n} \frac{1}{X + z_{i}}$.
- $\prod_{i = 1}^{n} (X + a_{i}) = \prod_{i = 1}^{n} (X + b_{i})$ iff $\sum_{i = 1}^{n}\frac{1}{(X + a_{i})} = \sum_{i = 1}^{n}\frac{1}{(X + b_{i})}$
- The multiplicity of a root of a polynomial can be captured in its logup. More
  concretely, if $P(X) = \prod_{i = 1}^{n}(X + a_{i})^{m_{i}}$, where $m_{i}$ is
  the multiplicity of the root $a_{i}$, we have $logup(P(X)) = \sum_{i =
  1}^{n}\frac{m_{i}}{(X + a_{i})}$
- If we represent $m_{i}$ as the evaluation of a polynomial over $\mathbb{K}$ (for
  $a \in \mathbb{K}$, $m(a) = 0$ if $a$ is a not root of $P(X)$ and $m_{i}$ if $a$ is a
  root), we can represent the logup using $logup(P(X)) = \sum_{a \in \mathbb{K}}\frac{m(a)}{(X + a)}$

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
