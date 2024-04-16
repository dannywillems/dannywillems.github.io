---
layout: post
title: Mutlivariate cryptography
date: 2024-03-31 10:02:36 +0000
author: Danny Willems
tags: [privacy, mutlivariate, cryptography]
---


Interesting reading: [Signature of correct
computations](https://eprint.iacr.org/2011/587.pdf) (sometimes called PST'13,
because accepted at TCC13).

Describe a multivariate polynomial commitment scheme based on some observations from KZG10.

I like the multiset representation of a multivariate polynomial, section 2.4.
Also, good description of KZG, see 1.3.

Good reminder to see the verification of a SNARK as a "public key" and the proof
as a "signature". The toxic waste can therefore be seen as a private key that we
must not keep.

Maybe the idea of using derivate evaluations $(f(x) - f'(a) x/(x - a)^2)$ is
something to dig into.
Wondering if the paper can be used for lookup arguments with large tables, using the decomposition of a polynomial $P(X) - P(a) \in \mathbb{F}[X_{1}, ..., X_{N}]$ in $\sum_{i = 1}^{N} (X_{i} - a_{i}) q_{i}(X)$
