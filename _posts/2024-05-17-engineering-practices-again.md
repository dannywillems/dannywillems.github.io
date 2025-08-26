---
layout: post
title: Cryptography/R&D engineering practices
date: 2024-05-16 10:02:36 +0000
author: Danny Willems
tags: [engineering, testing, documentation]
---

In the series "Engineering", I continue with some testing and documentation
notes. It follows:

- [The Rekt test, revisited](https://dannywillems.github.io/2024/01/20/the-rekt-test-revisited.html)
- [You said bugs? Key points I have learned over the years in FOSS development](https://dannywillems.github.io/2023/12/08/you-said-bugs.html)

As usual, it is top-of-my-head notes, and the document might evolve in the
future.

## Documentation

The entry point of an engineer code is the documentation. When an engineer
designs a library, they must think about the following:

- Their code will be read by others, and the entry level of the reader might not
  be as high as the author. Therefore, when implementing algorithms defined in
  papers, a link to the paper must be added. Any change or generalisation that
  is made from the paper must be commented, and an explanation/proof of the
  changes must be added.
- A clear description on how to install the library is required. A link to the
  documentation, if generated automatically, must be added.
- A clear description on how to run the tests is required.
- Design choice in the API must be explicitly listed.
- A clear explanation on how to use the library with the API must be given. The
  explanation is often accompanied by examples. As the library is meant to solve
  a problem, a concrete instance of the problem must be solved in the example.
  As any other code, the code of the example must be documented. Again, it is
  the entry point for the reader.

## Testing

- If implementing a cryptographic primitive, “test vectors” must be implemented.
  Test vectors are often provided by reference implementations. At least, the
  code must be tested against other libraries to verify that the output matches
  the specification. TDD must be applied in this case. Often, the structure of a
  test looks like this:

```ocaml
let random_input = Random.foo () in
let exp_output = Ref_implem(random_input) in
let output = Implem(random_input) in
assert_eq(exp_output, output)
```

- Random values must be generated using a known seed to be reproducible.
- If the implementation differs from a reference paper, proofs of what is
  claimed must be tested and commented. It is crucial and TDD must be applied.
- Test names must be explicit. The test name is the entry point for external
  contributors/readers. Therefore the reader must know what to expect from the
  test by reading the name. If the name is too long, keep the name shorter (but
  still explicit, and why it is different from the others) and adds
  documentation on top of the test name.
- Test body, when it can not be expressed simply as above, must explicitly
  contain a setup phase, and the test body must mention that is the setup.
