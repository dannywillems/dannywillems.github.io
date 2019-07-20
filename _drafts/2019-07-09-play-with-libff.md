---
post_date: 2019-07-09
author: Danny Willems
post_title: 'libff: cpp library to play with finite fields'
tags: [SNARK, ZK, Zero Knowledge, Finite Fields, libff, libsnark]
---

# DRAFT !!!!

I've been recently interested in the implementation of elliptic curves and zero
knowledge proof and I've
found [libff](https://github.com/scipr-lab/libff). This cpp library implements
some elliptic curves and provides a small API to represent the fields
$$\mathbb{F}_{p}$$ for p prime in cpp.
In particular, `libff` is used in
[libsnark](https://github.com/scipr-lab/libsnark).

libff uses [libgmp](https://gmplib.org/), a library dealing with arbitrary
precision arithmetic. You can represent arbitrary large naturals (`mp_limb_t`), integers (`mpz_t`),
rationals (`mpq_t`) and reals (`mpf_t`, even if the authors recommend to use the
more specific library
[mpfr](https://www.mpfr.org/)). I suppose the `mp` prefixes comes from `multiple
precision` and `z`/`q`/`r` for the respective describing set. A quick
introduction to basics can be found
[here](https://gmplib.org/manual/GMP-Basics.html#GMP-Basics). It is recommended
to read it to understand the different types used in libff. A particular
definition is `limb`, which is the type of a single machine word. Any type (or
any multiple precision number) uses multiple limbs.

The installation is quite straighforward by using the instructions given
[here](https://github.com/scipr-lab/libff#build-guide). For users on Ubuntu
18.04, `libprocps3-dev` has been replaced by `libprocps-dev` (`procps` is used
for profiling, it can be deactivated using the cmake option
`-DWITH_PROCPS=off`). For the article, we will suppose the library is installed
in `$LOCAL_LIBRARY_DIRECTORY`
(`-DCMAKE_INSTALL_PREFIX=$LOCAL_LIBRARY_DIRECTORY`).

The implementation is platform-dependent as some ASM code is used (for
optimisation I guess). It seems some ASM codes use can be deactivated by using
the cmake option `-DUSE_ASM=off`, but this option is only implemented for a few
parts.

Uppercase characters will be used to represent points and lowercase characters
will be used to represent scalars.


## Repository structure

- [exponentiation](https://github.com/scipr-lab/libff/tree/master/libff/algebra/exponentiation): implements the [exponentiation by squaring](https://en.wikipedia.org/wiki/Exponentiation_by_squaring) algorithm on a generic field T.
- [fields](https://github.com/scipr-lab/libff/blob/master/libff/algebra/fields):
  represent a generic field of order p in the class `Fp_model`. The interface
  of $$\mathbb{F}_p$$ is given in the file
  [fp.hpp](https://github.com/scipr-lab/libff/blob/master/libff/algebra/fields/fp.hpp) and its implementation in [fp.tcc](https://github.com/scipr-lab/libff/blob/master/libff/algebra/fields/fp.tcc).

## Further readings for me

When I've been going through the codebase, I've faced loads of algorithm names
or notions I did not know/have. Here a list:
- Bos-Coster algorithm
- Comba multiplication
- fast multiple exponentation: problem of computing $$\prod_{i = 0}^{n} g_{i}^{e_{i}}$$. I found [this article](https://www.bmoeller.de/pdf/multiexp-sac2001.pdf) written by Bodo Moeller. I'll need to have a look.
- fast scalar multiplication: problem of computing $$\sum_{i = 0}^{n} k_i P_i$$.
  This [pdf](https://cryptojedi.org/peter/data/eccss-20130911b.pdf) may be
  interesting to read.
- [Tonelli-Shanks algorithm](https://en.wikipedia.org/wiki/Tonelli%E2%80%93Shanks_algorithm)
- I've noticed the OCaml library [Zarith](https://github.com/ocaml/zarith) uses
  libgmp under the hood. Could be nice to have a look. Also, could be
  interesting to have some benchmarks.
- libff uses intensively cpp templates, especially with non type parameters. It
  was the first time I've been facing this syntax and [this
  page](http://www.cplusplus.com/doc/oldtutorial/templates/) helped me to
  understand what is going on. The part *Non-type parameters for templates* is
  the one you'd like to have a look if you want to know how it does work.
- [Montgomery
  reduction](https://github.com/scipr-lab/libff/blob/master/libff/algebra/fields/fp.tcc#L166)
