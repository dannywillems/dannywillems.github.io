---
layout: post
title: "Best practices for critical cryptographic code in Rust"
date: 2026-06-06 00:00:00 +0000
author: Danny Willems
tags: [rust, cryptography, security, engineering, best-practices]
---

Best practices for critical cryptographic code in Rust come down to layering.
Cheap automated lints catch panic and integer-cast bugs, but the
security-relevant work sits in dedicated tooling: constant-time execution,
secret zeroization, forbidding `unsafe`, undefined-behavior detection, and
supply-chain auditing. This post separates the two layers and gives a concrete
configuration for each.

<!--more-->

This article was written with the help of an AI assistant, working from my own
notes and the primary sources linked at the end. The point of mentioning it is
not novelty; it is that "AI helped write it" does not exempt the claims below
from the usual scrutiny. If something looks wrong, check the references.

The framing matters because it is easy to over-trust the linter. A clean
`cargo clippy` run tells you the code is tidy. It does not tell you the code is
constant-time, that keys are wiped from memory, or that a dependency has a known
advisory. Those are separate checks with separate tools.

## The two layers

A useful way to organize the work is to split it into a cheap layer and a
security layer.

**The cheap layer** is static analysis you run on every commit: the compiler's
own lints and Clippy. It is fast, it has near-zero false-negative cost to
enable, and it catches a specific set of bugs (panics, lossy casts, dead code).
It does not understand cryptography.

**The security layer** is the set of properties that actually matter for a
cipher, a signature scheme, or a key-derivation function: timing behavior,
memory hygiene, memory safety, and the integrity of your dependency tree. Most
of this cannot be expressed as a linter rule. It needs purpose-built crates and
analysis tools.

In my view the common mistake is spending effort tuning Clippy while leaving the
security layer to chance. The Clippy configuration below is worth having, but it
is the smaller half of the work.

## The cheap layer: Clippy lints worth denying

Clippy is not a security tool. It catches correctness and panic hygiene, which
matter for availability (a panic in verification code is a remote crash vector)
but say nothing about confidentiality or timing. With that scope in mind, the
lints below are the ones I lean toward enabling for cryptographic crates. They
go in the workspace `Cargo.toml`:

```toml
[workspace.lints.clippy]
# Panic hygiene: a panic in consensus or verification code is a crash vector.
unwrap_used      = "deny"
panic            = "deny"
indexing_slicing = "deny"   # buffer over-read panics; forces .get()
todo             = "deny"
unimplemented    = "deny"
expect_used      = "warn"   # tests and const init use it legitimately
unreachable      = "warn"   # sometimes a real invariant; document it

# Integer and cast correctness: a frequent source of crypto bugs.
cast_possible_truncation = "warn"
cast_possible_wrap       = "warn"
cast_sign_loss           = "warn"
cast_lossless            = "warn"
integer_division         = "warn"   # silent floor division
modulo_arithmetic        = "warn"

# Crypto should not touch floating point: non-determinism plus data-dependent timing.
float_arithmetic = "deny"

# mem::forget on a zeroizing wrapper leaks the secret instead of scrubbing it.
mem_forget = "deny"
```

A note on the split between `deny` and `warn`: I deny the lints whose violations
are almost always wrong in cryptographic library code (`unwrap_used`, `panic`,
`indexing_slicing`, `float_arithmetic`) and warn on the ones that have
legitimate exceptions (`expect_used` in test setup, the cast lints where a cast
is provably safe). The full lint list is in the Clippy documentation
([rust-lang.github.io/rust-clippy][clippy-lints]).

Enabling these on an existing codebase is a multi-commit cleanup, not a one-line
change. Each denied lint surfaces existing call sites that need either a fix or
a documented `#[allow]`. That is expected and is part of the value.

## The lint to skip: blanket arithmetic checking

Clippy has a lint, `arithmetic_side_effects` (formerly `integer_arithmetic`),
that flags every `+`, `-`, and `*` that could overflow or panic. It is tempting
to deny it in cryptographic code. I think that is a mistake for a codebase that
does field arithmetic.

The reason is that in cryptography, wrapping and modular arithmetic are often
intentional. Limb-based big-integer math, modular reduction, counters, and
operations over `Wrapping<u64>` or `u128` rely on defined overflow behavior.
Denying `arithmetic_side_effects` across such a codebase produces a large number
of false positives and pushes contributors toward blanket `#[allow]` attributes,
which is worse than not having the lint, because it trains people to silence it
reflexively.

If you want overflow protection, two narrower approaches tend to work better:

- Enable runtime overflow checks where the performance cost is acceptable, for
  example in test and fuzzing builds:

  ```toml
  [profile.test]
  overflow-checks = true
  ```

  Rust performs these checks in debug builds by default and omits them in
  release builds (RFC 560, [the integer overflow RFC][rfc560]). Turning them on
  for the test profile catches overflow during CI and fuzzing without paying the
  cost in production.

- Make intent explicit at the call site with `checked_*`, `wrapping_*`, or
  `saturating_*`. This documents whether an overflow is a bug or by design,
  which a blanket lint cannot.

## The security layer

This is where most of the actual protection comes from. None of the items below
is a Clippy lint.

### Forbid unsafe, then carve out FFI

The single highest-value lint is a compiler lint, not a Clippy one:

```toml
[workspace.lints.rust]
unsafe_code = "forbid"
```

Forbidding `unsafe` removes a class of memory-safety bugs (use-after-free,
out-of-bounds writes, data races on `Sync` types). For context on how large that
class is: Microsoft reported that roughly 70% of the CVEs it assigned over a
12-year window were memory-safety issues ([MSRC, 2019][msrc]), and the Chromium
project reported a similar proportion of around 70% for its severe security bugs
([Chromium security][chromium]). Rust's safe subset does not produce those bugs.

It does not remove logic bugs, and it does not make non-`unsafe` code
constant-time, so this is one control among several rather than a complete
answer. Where you genuinely need `unsafe`, typically when wrapping a C library
or an assembly routine, isolate it in a dedicated crate or module and downgrade
the lint there with an explicit `#[allow(unsafe_code)]` and a comment explaining
the invariant being upheld.

### Constant-time operations

Comparisons and selections on secret data must not branch or short-circuit on
the secret, because the timing of a data-dependent branch can leak the secret.
This is a well-documented attack class going back to Kocher's 1996 timing-attack
paper ([Kocher, CRYPTO '96][kocher]).

A naive equality check leaks:

```rust
// Leaky: returns as soon as the first differing byte is found.
fn verify_tag(a: &[u8], b: &[u8]) -> bool {
    a == b
}
```

The `subtle` crate provides constant-time primitives that do not branch on the
secret value ([docs.rs/subtle][subtle]):

```rust
use subtle::ConstantTimeEq;

fn verify_tag(a: &[u8], b: &[u8]) -> bool {
    a.ct_eq(b).into()
}
```

One caveat worth stating plainly: constant-time guarantees in a high-level
language are best-effort. Compiler optimizations and CPU microarchitecture can
reintroduce data-dependent timing that the source does not show. `subtle`
reduces the risk; it does not eliminate it. Empirical timing tests
(`dudect`-style measurement) are the way to check the property rather than
assume it.

### Zeroize secrets

Key material left in freed memory can be recovered from a core dump, a swap
file, or a later allocation. The `zeroize` crate scrubs memory on drop in a way
the compiler is not allowed to optimize away ([docs.rs/zeroize][zeroize]):

```rust
use zeroize::Zeroizing;

let mut key = Zeroizing::new([0u8; 32]);
// ... use key ...
// key is wiped when it goes out of scope.
```

This is also why `clippy::mem_forget` is in the deny list above: calling
`mem::forget` on a `Zeroizing` value skips the destructor and leaves the secret
in memory, which is the opposite of the intent.

### Detect undefined behavior

If you have any `unsafe` or FFI, the type system cannot vouch for it. Two tools
exercise it for undefined behavior:

- **Miri**, an interpreter that detects UB such as invalid pointer use and data
  races ([rust-lang/miri][miri]):

  ```bash
  cargo +nightly miri test
  ```

- **cargo-careful**, which runs the standard library with extra debug assertions
  enabled ([cargo-careful][careful]):

  ```bash
  cargo careful test
  ```

Both are slower than a normal test run, so they tend to live in a scheduled or
pre-release CI job rather than on every push.

### Audit the supply chain

A cryptographic implementation is only as trustworthy as its dependencies. Two
tools cover most of this:

- **cargo-audit** checks your dependency tree against the RustSec advisory
  database ([rustsec.org][rustsec]):

  ```bash
  cargo audit
  ```

- **cargo-deny** checks advisories, license compliance, banned crates, and
  duplicate versions in one pass ([cargo-deny][deny]):

  ```bash
  cargo deny check
  ```

Running both in CI, with the build failing on a new advisory, keeps a known-bad
dependency from shipping silently.

## A minimal checklist

For a crate handling key material or implementing a primitive, this is the set I
would want in place:

1. `unsafe_code = "forbid"` at the workspace level, with explicit carve-outs for
   FFI crates only.
2. The Clippy panic and cast lints above, denied or warned as listed.
3. `subtle` for any comparison or selection on secret data.
4. `zeroize` for any in-memory key material, plus `clippy::mem_forget = "deny"`.
5. `overflow-checks = true` on the test profile, and explicit
   `checked_*`/`wrapping_*` at call sites instead of a blanket arithmetic lint.
6. Miri or cargo-careful in CI for any crate containing `unsafe`.
7. `cargo audit` and `cargo deny check` in CI, failing on new advisories.

The Clippy items are the cheapest to add and the least important to security.
The `unsafe`, timing, zeroization, and supply-chain items take more effort and
carry most of the weight.

## Frequently asked questions

### Does Clippy catch timing side channels?

No. Clippy performs syntactic and type-level analysis. It cannot reason about
the timing behavior of compiled code, which depends on the optimizer and the
target CPU. Use the `subtle` crate for constant-time operations and empirical
timing tests to verify the property.

### Should I deny `clippy::arithmetic_side_effects` in cryptographic code?

Generally not, if the code does field or big-integer arithmetic. Wrapping and
modular arithmetic are intentional there, so the lint produces many false
positives. Prefer `overflow-checks = true` on test builds plus explicit
`checked_*`/`wrapping_*`/`saturating_*` calls that document intent.

### Is `#![forbid(unsafe_code)]` enough for memory safety?

It removes the memory-safety bugs that come from `unsafe` blocks in your own
crate, which is a large class (around 70% of CVEs in comparable C and C++
codebases per Microsoft and Chromium figures). It does not cover `unsafe` inside
your dependencies, and it does not address logic bugs or timing. Treat it as one
strong control, not a complete guarantee.

### What is the difference between `cargo audit` and `cargo deny`?

`cargo audit` checks the dependency tree against the RustSec advisory database
for known vulnerabilities. `cargo deny` does that and also enforces license
policy, bans specific crates, and flags duplicate dependency versions. Many
projects run `cargo deny check` and rely on it for the advisory check as well.

## References

- [Clippy lint list][clippy-lints]
- [RFC 560: Integer overflow][rfc560]
- [subtle crate documentation][subtle]
- [zeroize crate documentation][zeroize]
- [Miri][miri]
- [cargo-careful][careful]
- [RustSec advisory database][rustsec]
- [cargo-deny][deny]
- P. Kocher, "Timing Attacks on Implementations of Diffie-Hellman, RSA, DSS, and
  Other Systems", CRYPTO '96 ([PDF][kocher])
- [Microsoft Security Response Center: a proactive approach to more secure
  code][msrc]
- [Chromium project: memory safety][chromium]

[clippy-lints]: https://rust-lang.github.io/rust-clippy/master/index.html
[rfc560]:
  https://github.com/rust-lang/rfcs/blob/master/text/0560-integer-overflow.md
[subtle]: https://docs.rs/subtle/latest/subtle/
[zeroize]: https://docs.rs/zeroize/latest/zeroize/
[miri]: https://github.com/rust-lang/miri
[careful]: https://github.com/RalfJung/cargo-careful
[rustsec]: https://rustsec.org/
[deny]: https://github.com/EmbarkStudios/cargo-deny
[kocher]: https://www.rambus.com/wp-content/uploads/2015/08/TimingAttacks.pdf
[msrc]:
  https://msrc.microsoft.com/blog/2019/07/a-proactive-approach-to-more-secure-code/
[chromium]: https://www.chromium.org/Home/chromium-security/memory-safety/
