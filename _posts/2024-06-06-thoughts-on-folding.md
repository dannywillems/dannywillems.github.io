---
layout: post
title: Thoughts on folding schemes
date: 2024-06-06 10:02:36 +0000
author: Danny Willems
tags: [folding, cryptography, homogeneous, multivariate polynomials]
---

Morning thoughts while talking to some friends.

The "relaxation" process in folding schemes are mostly about transforming
polynomials into an homogeneous form of a certain degree, see [o1Labs
documentation](https://o1-labs.github.io/proof-systems/rustdoc/folding/expressions/index.html).
For instance, Nova introduced the concept of relaxation for degree 2 polynomials.

On the other side, jacobian coordinates and projective coordinates of elliptic
curves (as a reminder, elliptic curves points are zeroes of multivariate
polynomials - for instance `P(X, Y) = X^3 + a X + b - Y^2)` are homogeneous forms
of the polynomial equations describing the curve. For instance, projective
coordinates transform `P(X, Y) = X^3 + a X + b - Y^2` into a polynomial
`P(X, Y, Z) = X^3 + a Z^2 X + b Z^3 - Z Y^2`.

When we are making an IVC proof, we are aggregating randomized commitments,
which are elliptic curves points of a prime order. Therefore, there are of the
form g^x, with x being a scalar field, and g^x is a value that can be
represented as a triplet satisfying an homogeneous polynomial. Thought stops
here, but I'm wondering if we can make a link between both. And also if there
are some optimisations possible for the IVC verifier.

Folding schemes allow to only focus on making a proof of the computation of
`P(X' + r X, Y' + r Y, Z' + r Z)` which englobes the computation of `P(r X, r Y,
r Z)` and `P(X', Y', Z')`, plus an additional error term we "ignore", defined by
a polynomial `E(X, Y, Z, r X', r Y', r Z')`.
