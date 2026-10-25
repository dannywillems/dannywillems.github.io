---
layout: post
title:
  "Fuzzing and high-assurance cryptography, from classical primitives to
  zero-knowledge"
date: 2026-06-06 12:00:00 +0000
author: Danny Willems
tags:
  [cryptography, fuzzing, zero-knowledge, security, rust, formal-verification]
---

Fuzzing in cryptography splits into two families. For classical primitives
(ciphers, hashes, signatures) the mature technique is differential fuzzing: run
the same input through several implementations and flag any disagreement. For
zero-knowledge (ZK) systems the harder problem is the missing oracle, since a
soundness bug produces a proof that verifies but should not, and there is
nothing to compare it against. This post surveys both, names the tools that
exist in research and in industry, and lists what you can actually wire into a
Rust codebase today and what is still missing.

<!--more-->

The framing comes from the
[Tachyon / Ragu post](https://tachyon.z.cash/blog/folding-tachyon-with-ragu/),
which describes its design goal as "high-assurance cryptography" and leans
toward mature, audited components and post-2021 assumptions rather than novel
constructions. That is one lever for assurance: reduce the surface you have to
trust. This post is about the other levers, the testing and verification
techniques that sit underneath that goal, with an emphasis on fuzzing.

This article was written entirely by an AI assistant, working from my framing
and from the primary sources linked at the end. I curated the topic and the
sources and reviewed the result, but the prose is fully AI-generated. Saying so
is not a disclaimer of responsibility: "AI wrote it" does not exempt the claims
below from scrutiny. If something looks wrong, check the references.

## The assurance spectrum

It helps to place techniques on a spectrum from cheap-and-incomplete to
expensive-and-complete. Each row finds a different class of defect, and they
compose rather than replace each other.

| Technique                | Cost   | Guarantee                | Finds                               |
| ------------------------ | ------ | ------------------------ | ----------------------------------- |
| Unit tests, test vectors | low    | examples only            | known-answer mismatches             |
| Property-based testing   | low    | random sampling          | broken algebraic laws, round-trips  |
| Coverage-guided fuzzing  | medium | best-effort, unbounded   | panics, memory bugs, crashes        |
| Differential fuzzing     | medium | relative to a reference  | logic divergences between impls     |
| Metamorphic testing      | medium | relative to an invariant | bugs without a reference oracle     |
| Formal verification      | high   | proof over all inputs    | functional and side-channel defects |

Fuzzing occupies the middle. It is more thorough than hand-written tests and
much cheaper than a machine-checked proof. In my view the practical mistake is
treating these as alternatives. A team that has a verified field implementation
still benefits from a differential fuzzer over the unverified glue around it.

## Part I: fuzzing classical cryptography

### Coverage-guided fuzzing, briefly

A coverage-guided fuzzer mutates inputs and keeps the ones that reach new code
paths, building a corpus that drives execution into rarely-visited branches.
With sanitizers (AddressSanitizer, MemorySanitizer, UBSan) attached, it surfaces
memory-safety and undefined-behavior bugs. This is effective for parsers and
decoders, where malformed input is the threat model: certificate parsers, ASN.1
decoders, signature deserialization.

The limit is the oracle. A plain fuzzer can tell that the code crashed. It
cannot tell that a non-crashing output is cryptographically wrong. That is the
gap differential and property-based methods fill.

### Differential fuzzing

Differential fuzzing runs one input through two or more implementations of the
same primitive and reports any disagreement. The disagreement is the oracle: if
OpenSSL and BoringSSL compute different AES-GCM tags for the same key, nonce,
and plaintext, at least one is wrong.

The reference tool is
[Cryptofuzz](https://github.com/MozillaSecurity/cryptofuzz) by Guido Vranken,
built on libFuzzer. It is described as the first differential fuzzing tool to
use mutation and code coverage to find cryptographic discrepancies, and it has
compared dozens of libraries against each other and reported a long list of real
bugs. Two concrete classes it has surfaced, documented in
[Quarkslab's write-up](https://blog.quarkslab.com/differential-fuzzing-for-cryptography.html),
are logic errors (for example a `jb` instruction where `jbe` was needed in an
OpenSSL AES-OCB length check) and digest miscomputations at specific message
sizes (an MD5 failure when the message length falls in a particular residue
class).

The research lineage around it is worth knowing:

- **CDF** (Crypto Differential Fuzzing) was an early tool using hand-written
  input rules rather than coverage feedback.
- **[Nezha](https://ieeexplore.ieee.org/document/7958601)** introduced
  delta-diversity, a domain-independent way to steer a differential fuzzer
  toward inputs that maximize behavioral divergence between programs.
- **DifFuzz** targets side-channel vulnerabilities by maximizing the resource
  difference between two runs that share a public input but differ on a secret.
- **[CLFuzz](https://dl.acm.org/doi/10.1145/3628160)** adds semantic-aware input
  generation so that the fuzzer produces well-formed algorithm parameters (valid
  key sizes, valid curve points) more often.
- Later work on hybrid differential fuzzing combines a coverage-guided fuzzer
  with concolic execution and crypto-specific mutation to push past plateaus in
  coverage (for example the
  [ICISC 2022](https://link.springer.com/chapter/10.1007/978-3-031-29371-9_7)
  and
  [ICISC 2024](https://link.springer.com/chapter/10.1007/978-981-96-5566-3_10)
  papers).

Differential fuzzing has one structural weakness: it can only find a bug that
exactly one of the compared implementations has. A bug present in every
implementation, or in the only implementation of a new primitive, is invisible
to it. That is exactly the situation for most ZK constructions, which is why
Part II needs different oracles.

### Test vectors as a complement

[Project Wycheproof](https://github.com/C2SP/wycheproof) is not a fuzzer; it is
a large corpus of known-answer and edge-case test vectors (weak curve points,
boundary nonces, malformed signatures) that any implementation can run against.
It complements fuzzing: fuzzing explores the input space you did not think of,
while Wycheproof pins the edge cases the community already learned the hard way.
Running both is cheap and they overlap little.

### The high-assurance end: verified implementations

At the far end of the spectrum, several projects replace testing with proof for
the primitive itself:

- **[HACL\*](https://github.com/hacl-star/hacl-star)** is a cryptographic
  library written in F\* and compiled to C, with each primitive verified for
  memory safety, functional correctness, and secret independence (a
  constant-time property). It covers Curve25519, Ed25519, ChaCha20-Poly1305,
  AES-GCM, the SHA-2 and SHA-3 families, HMAC, and HKDF. Code from HACL\* and
  the related EverCrypt provider ships in Firefox's NSS, the Linux kernel,
  mbedTLS, and elsewhere.
- **[Fiat-Crypto](https://github.com/mit-plv/fiat-crypto)** generates verified
  field-arithmetic C code from Coq specifications; its output is used in Chrome
  (BoringSSL) and Android.
- **[Jasmin](https://github.com/jasmin-lang/jasmin)** and
  **[Vale](https://github.com/project-everest/vale)** are frameworks for writing
  assembly-level crypto whose functional correctness and constant-time behavior
  are machine-checked, with the Jasmin compiler itself verified in Coq.

The trade-off is effort and coverage. Verification gives a guarantee over all
inputs, but it covers the primitive, not the protocol wiring, the serialization,
or the application logic around it. Fuzzing remains useful precisely on that
unverified perimeter. The two are widely treated as complementary rather than
substitutes.

## Part II: fuzzing zero-knowledge systems

ZK proof systems are harder to test than classical primitives for one core
reason: the most dangerous bugs are silent. A soundness bug lets a malicious
prover produce a proof of a false statement that the verifier accepts. Nothing
crashes. There is no reference implementation that computes the "right" answer,
because the statement is false and should have had no proof at all.

### The bug taxonomy

The literature, including the [zkFuzz](https://arxiv.org/abs/2504.11961) and
[Towards Fuzzing Zero-Knowledge Proof Circuits](https://arxiv.org/abs/2504.14881)
papers, distinguishes several classes. Naming them precisely matters, because
each needs a different oracle:

- **Under-constrained circuit.** The constraint system is too loose, so a prover
  can satisfy it with witnesses that do not correspond to the intended
  computation. This is the canonical ZK soundness bug and the source of most of
  the high-impact findings in audits.
- **Over-constrained circuit.** The constraints are too tight, so some
  legitimate inputs cannot produce a valid proof. This breaks completeness, not
  soundness, and tends to show up as availability problems rather than exploits.
- **Correctness error.** The circuit faithfully constrains the wrong computation
  (the classic example is constraining addition where multiplication was
  intended). Constraints are satisfied; the logic is simply not what was meant.
- **Completeness vs soundness bugs** are the two failure directions: a valid
  input that fails to prove (completeness) versus an invalid input that
  nonetheless verifies (soundness).

### The oracle problem, restated for ZK

The papers frame the testing difficulty as an oracle problem with three answers:

1. **Spec-based.** If a formal specification of the intended relation exists,
   you can in principle check all three bug classes against it. The cost is
   writing and maintaining the spec.
2. **Differential.** Compare the circuit against a reference implementation of
   the same function (for example a circuit that matches regular-expression
   behavior against a host-language regex engine). This catches correctness and
   completeness bugs but not soundness bugs the reference does not model.
3. **Invariant-based / metamorphic.** Use properties that must hold regardless
   of the concrete output, for example determinism, or the relation between a
   program and a semantically equivalent transformed version. This is the most
   promising route to catching soundness bugs without a reference.

For soundness specifically, the proposed technique is mutation from valid
witnesses: start from a witness that should be the unique satisfying assignment,
perturb it, and check whether the perturbed (and now invalid) witness still
satisfies the constraints. If it does, the circuit is under-constrained.

### Three layers to attack

It is useful to separate where a ZK bug can live, because the tooling differs by
layer:

1. **The circuit.** The constraint system a developer writes (in Circom, Noir,
   halo2, gnark, and similar). This is where under-constrained bugs live.
2. **The compiler / toolchain.** The DSL compiler that lowers a high-level
   program to a constraint system. A correct circuit can be miscompiled.
3. **The backend.** The prover and verifier implementing the proof system, plus
   the field and curve arithmetic underneath. Classical fuzzing applies here.

### Tools by category

Most public tooling targets Circom, since it has the largest deployed circuit
base, but the techniques generalize. A useful overview is the
[zkSecurity "State of Security Tools for ZKPs"](https://blog.zksecurity.xyz/posts/zksecurity-tools/)
post and the
[Awesome-ZKP-Security](https://github.com/StefanosChaliasos/Awesome-ZKP-Security)
list.

**Static analysis** (pattern and dataflow, no execution):

- **[Circomspect](https://github.com/trailofbits/circomspect)** (Trail of Bits)
  flags suspicious Circom patterns, including signals that are assigned but not
  constrained.
- **ZKAP** uses circuit dependence graphs to find anti-patterns associated with
  under-constrained signals.
- **halo2-analyzer / korrekt** targets under-constrained columns in halo2
  circuits.

**Formal and solver-based verification:**

- **[Picus](https://github.com/Veridise/Picus)** (Veridise) verifies the
  uniqueness property: that the circuit's outputs are uniquely determined by its
  inputs, which is exactly the absence of under-constrained behavior. It
  combines lightweight static analysis with an SMT backend.
- **[Ecne](https://github.com/franklynwang/EcneProject)** checks whether an R1CS
  system uniquely determines its outputs.
- **CIVER**, **Coda**, and gnark-to-Lean transpilation pursue the same goal
  through deductive verification or proof-assistant embeddings.

**Dynamic analysis, fuzzing, and metamorphic testing:**

- **[SNARKProbe](https://github.com/BARC-Purdue/SNARKProbe)** (ACNS 2024) is an
  automated framework for R1CS-based libraries such as libsnark, bellman, and
  arkworks. It combines fuzzing of the R1CS input with an SMT-backed value model
  that re-evaluates the protocol to catch cryptographic logic errors and
  inconsistencies with the protocol description.
- **[zkFuzz](https://arxiv.org/abs/2504.11961)** introduces the Trace-Constraint
  Consistency Test (TCCT), a language-independent formulation that captures both
  under- and over-constrained bugs, and a program-mutation fuzzer that detects
  TCCT violations. In its evaluation on 452 real-world Circom circuits it
  reported 85 bugs, including 59 zero-days, with developers confirming and
  fixing dozens of them. It also demonstrates feasibility on Noir.
- **[Circuzz](https://mariachris.github.io/Pubs/CCS-2025.pdf)** (CCS 2025)
  fuzzes the processing pipeline itself, using circuit transformation and
  translation as metamorphic relations, and reported bugs across Circom, Corset,
  gnark, and Noir.
- **[MTZK](https://www.ndss-symposium.org/ndss-paper/mtzk-testing-and-exploring-bugs-in-zero-knowledge-zk-compilers/)**
  (NDSS 2025) applies metamorphic testing to ZK compilers, mutating compiler
  inputs in ways that should preserve meaning and checking that the compiled
  circuits still agree.
- The **zk-regex** case study in the "Towards Fuzzing" paper is a small but
  instructive example: a grammar-based fuzzer with differential testing against
  a host regex engine found 13 developer-confirmed bugs (5 correctness, 8
  completeness).

For background on why these systems break in the first place, the SoK paper
[What don't we know? Understanding Security Vulnerabilities in SNARKs](https://arxiv.org/abs/2402.15293)
catalogs vulnerability classes across the stack, and
[zkSecurity's zkbugs](https://bugs.zksecurity.xyz) is a public knowledge base of
reproduced ZK bugs.

### What the research says is still missing

Two recurring gaps come up in the surveys. First, the infrastructure layer (the
DSL frontends and the prover/verifier backends) has received less attention than
the circuits themselves, even though a compiler bug undermines every circuit
built with it. Second, SMT-based tools like Picus run into finite-field
arithmetic, which is a weak spot for general-purpose solvers and a performance
bottleneck on larger circuits. The zkSecurity overview also notes the absence of
a widely-adopted property-based testing framework for circuits comparable to
QuickCheck or Foundry.

## Part III: what to use in a Rust codebase today

Much of the ZK and modern-crypto ecosystem is written in Rust (arkworks, halo2,
plonky2/3, gnark is Go, Noir's backend is Rust). Here is what is actually
wireable today, from least to most effort.

### Property-based testing: the cheapest oracle you already have

Before reaching for a fuzzer, encode the algebraic laws your types must obey as
properties. For finite fields and curves these are unusually strong oracles
because the math is exact:

- field axioms: commutativity, associativity, distributivity, `a + (-a) == 0`,
  `a * a.inverse() == 1` for nonzero `a`;
- serialization round-trips: `deserialize(serialize(x)) == x` for every value
  and every wire format;
- curve laws: `P + (-P)` is the identity, scalar-multiplication distributes, the
  group order annihilates;
- protocol round-trips: `verify(prove(witness)) == true` (completeness).

Use [`proptest`](https://github.com/proptest-rs/proptest) or
[`quickcheck`](https://github.com/BurntSushi/quickcheck) for these. They are
generation-based: they sample random inputs each run rather than building a
persistent coverage-guided corpus. The arkworks crates already carry a body of
such tests; extending them to your own circuits is low-effort and catches a
large fraction of correctness bugs early.

### Coverage-guided fuzzing: the Rust toolchain

For anything that parses or deserializes attacker-controlled bytes (proof blobs,
serialized field elements, transcripts), run a coverage-guided fuzzer:

| Tool                                                        | Engine           | Notes                                                                   |
| ----------------------------------------------------------- | ---------------- | ----------------------------------------------------------------------- |
| [`cargo-fuzz`](https://github.com/rust-fuzz/cargo-fuzz)     | libFuzzer        | most common; needs nightly and an LLVM sanitizer toolchain              |
| [`afl.rs`](https://github.com/rust-fuzz/afl.rs)             | AFL++            | strong corpus management, mature mutators                               |
| [`honggfuzz-rs`](https://github.com/rust-fuzz/honggfuzz-rs) | honggfuzz        | built-in crash, leak, and coverage analysis                             |
| [`bolero`](https://github.com/camshaft/bolero)              | any of the three | one harness runs under libFuzzer, AFL, honggfuzz, or as a property test |

[`arbitrary`](https://github.com/rust-fuzz/arbitrary) turns the raw byte stream
into structured inputs (a `struct` of field elements, a typed transcript) so the
fuzzer spends its budget on meaningful values rather than rejected garbage. The
[Rust Fuzz Book](https://rust-fuzz.github.io/book/) is the reference.

In my view `bolero` is the pragmatic default for a new crypto crate: you write
the harness once, run it as a fast `proptest`-style check in CI, and escalate
the same target to a long libFuzzer or AFL campaign when you have machine time.
That keeps the property-based and coverage-guided layers from drifting apart.

### Differential fuzzing: build the harness yourself

There is no off-the-shelf Cryptofuzz for the Rust ZK stack, so this is mostly a
do-it-yourself harness, but the pattern is simple and high-value:

- two implementations of the same field or curve (for example arkworks against a
  second library, or an optimized assembly path against the generic Rust path)
  fed identical inputs, asserting equal outputs;
- a circuit against a plain Rust reference implementation of the same function
  (the zk-regex approach), asserting the circuit accepts exactly when the
  reference says it should;
- mutation-from-valid-witness as a soundness check: generate a satisfying
  witness, perturb it, and assert the constraint system now rejects it. A
  surviving perturbation is an under-constrained signal.

`arbitrary` plus `bolero` is enough scaffolding to drive any of these. The third
pattern is the one that targets the soundness bugs differential testing alone
cannot see.

### A practical layering for a Rust crypto or ZK crate

1. property tests for every algebraic and serialization invariant (`proptest` /
   `bolero` check mode);
2. coverage-guided fuzz targets for every deserialization boundary (`cargo-fuzz`
   or `bolero`), run with sanitizers in CI and longer out-of-band;
3. a differential harness against a second implementation where one exists;
4. a witness-mutation harness for each circuit to probe for under-constraining;
5. for the highest-value primitives, evaluate whether a verified component
   (HACL\* via bindings, Fiat-Crypto-generated field code) can replace a
   hand-written one.

## Frequently asked questions

### Is fuzzing a substitute for an audit or formal verification?

No. Fuzzing is unbounded best-effort search; it can find bugs but cannot prove
their absence. It reduces the number of defects an audit has to catch and gives
auditors reproducible test cases, but the categories are complementary.

### Why can't I just diff two ZK implementations like I diff two AES libraries?

Differential testing only finds bugs that one side has and the other does not,
and it requires the compared programs to agree on what "correct" means. For a
soundness bug there is no correct output to compare to, because the statement
being proved is false. That is why ZK testing leans on metamorphic relations and
witness mutation instead.

### What is the single highest-value thing to add to an existing Rust ZK crate?

In my view, a witness-mutation harness per circuit. It directly targets
under-constrained bugs, which are the dominant high-severity class in ZK audits,
and it needs only the prover you already have plus a mutation loop.

### Does using a verified library like HACL\* make fuzzing unnecessary?

It removes the need to fuzz the verified primitive for functional correctness,
but not the surrounding code: serialization, protocol state machines, and any
unverified glue still need testing. Verification narrows the perimeter; it does
not eliminate it.

## References

Classical cryptography and differential fuzzing:

- Cryptofuzz: <https://github.com/guidovranken/cryptofuzz>
- Quarkslab, "Differential fuzzing for cryptography":
  <https://blog.quarkslab.com/differential-fuzzing-for-cryptography.html>
- Nezha (IEEE S&P 2017): <https://ieeexplore.ieee.org/document/7958601>
- CLFuzz (TOSEM): <https://dl.acm.org/doi/10.1145/3628160>
- Hybrid differential fuzzing (ICISC 2022):
  <https://link.springer.com/chapter/10.1007/978-3-031-29371-9_7>
- Project Wycheproof: <https://github.com/C2SP/wycheproof>

High-assurance cryptography:

- HACL\* and EverCrypt: <https://github.com/hacl-star/hacl-star>
- Fiat-Crypto: <https://github.com/mit-plv/fiat-crypto>
- Jasmin: <https://github.com/jasmin-lang/jasmin>

Zero-knowledge testing and verification:

- SoK, "Understanding Security Vulnerabilities in SNARKs":
  <https://arxiv.org/abs/2402.15293>
- zkFuzz (arXiv 2504.11961): <https://arxiv.org/abs/2504.11961>
- Towards Fuzzing ZKP Circuits (arXiv 2504.14881):
  <https://arxiv.org/abs/2504.14881>
- Circuzz (CCS 2025): <https://mariachris.github.io/Pubs/CCS-2025.pdf>
- MTZK (NDSS 2025):
  <https://www.ndss-symposium.org/ndss-paper/mtzk-testing-and-exploring-bugs-in-zero-knowledge-zk-compilers/>
- SNARKProbe (ACNS 2024): <https://github.com/BARC-Purdue/SNARKProbe>
- Picus: <https://github.com/Veridise/Picus>
- Circomspect: <https://github.com/trailofbits/circomspect>
- zkSecurity, "State of Security Tools for ZKPs":
  <https://blog.zksecurity.xyz/posts/zksecurity-tools/>
- zkbugs knowledge base: <https://bugs.zksecurity.xyz>
- Awesome-ZKP-Security:
  <https://github.com/StefanosChaliasos/Awesome-ZKP-Security>

Rust fuzzing toolchain:

- Rust Fuzz Book: <https://rust-fuzz.github.io/book/>
- cargo-fuzz: <https://github.com/rust-fuzz/cargo-fuzz>
- bolero: <https://github.com/camshaft/bolero>
- arbitrary: <https://github.com/rust-fuzz/arbitrary>
- proptest: <https://github.com/proptest-rs/proptest>
