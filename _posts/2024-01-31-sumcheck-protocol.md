---
layout: post
title: The Sumcheck protocol
date: 2024-01-31 10:02:36 +0000
author: Danny Willems
tags: [privacy, toolkit]
---

Based on
[MVLookup](https://github.com/Orbis-Tertius/MVlookups/blob/main/MVlookup.pdf).

Page 8. Let's see an example.

Let's say the polynomial is
$P(X_1, X_2, X_3) = X_1^{2} + 3 X_{2} X_{1} + X_{3}^3$ Let's say at step $1$,
the random element was $1$.

At step 2, the prover will send the coefficients of the polynomial:

$$
\begin{align}
s_{2}(X) & = \sum_{x \in \{1, -1\}}P(1, X, x) \\
         & = p(1, X, 1) + p(1, X, -1) \\
         & = 1 + 3X + 1 + 1 + 3X - 1 \\
         & = 6 X + 2
\end{align}
$$

The coefficients are $6$ and $2$, and the degree is $1$.

The verifier will check that $s_{1}(1) = s_{2}(1) + s_{2}(-1)$, which
corresponds to the equality check $s_{i - 1}(r_{i - 1}) = s_{i}(1) + s_{i}(-1)$.

TODO: compute

$$
\begin{align}
s_{1}(X) & = \sum_{(x_{1}, x_{2}) \in \{\pm 1\}^{2}} P(X, x_{1}, x_{2}) \\
         & = P(X, 1, 1) + P(X, 1, -1) + P(X, -1, 1) + P(X, -1, -1)
\end{align}
$$
