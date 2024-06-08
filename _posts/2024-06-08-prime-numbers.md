---
layout: post
title: Facts about prime numbers
date: 2024-06-08 10:02:36 +0000
author: Danny Willems
tags: [prime, numbers, compression]
---

I've always loved prime numbers. I don't remember since when, but as far as I
remember, including my kid's life, I have always mentioned prime numbers as magic
numbers. I remember being excited in front of [this
episode](https://iv.melmac.space/watch?v=ee2If8jSxUo) (or
[YT](https://youtu.be/ee2If8jSxUo) of Doctor Who, 42, where
they mentioned [happy prime numbers](https://en.wikipedia.org/wiki/Happy_number).

Since the boom of verifiable computation, prime numbers became a significant
rock stars.

I'm keeping a list here of facts I love mentioning about prime numbers. It will
be mostly used to compile ideas of interesting projects to build with.

I also love translating things into prime numbers to solve problems using
basic algebra.
For instance, take a list of strings (can be generalized to a list of
symbols). And take the usual following problem: given two strings s1 and s2, are
they sharing some letters?
Assign a prime numbers to each letter of the alphabet, and translate the strings
into their products of the primes. If the two strings share some characters,
their greatest common divisor will be different than one.

From there, you can have: if s1 has all its letters in s2, then p(s1) divides
p(s2).
This problem on strings can be optimised using assembly instructions directly
and only a few number of registers.

Some interesting facts:

- [Elliott Halberstam
  conjecture](https://en.wikipedia.org/wiki/Elliott-Halberstam_conjecture):
  there are infinite number of sexy prime (i.e. |p_(n+1) - p_n| = 6). 37 is one
  sexy prime, like 11, 17, 31, 43, etc.
- Interesting video from [Terrence
  Tao](https://www.youtube.com/watch?v=pp06oGD4m00).
  - infinite prime numbers separated by 2.
- Mersenne primes (2^n - 1) are good for multiplications in decimal
  representation on computers, because it is implemented as bitshifts.
