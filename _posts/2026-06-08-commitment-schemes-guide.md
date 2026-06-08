---
layout: post
title:
  "The Definitive Guide to Cryptographic Commitment Schemes: Theory,
  Construction, and Applications"
date: 2026-06-08 00:00:00 +0000
author: Danny Willems
use_math: true
tags: [cryptography, commitments, zero-knowledge, mpc, post-quantum, theory]
---

A commitment scheme lets a party fix a value in a sealed envelope, hand the
envelope to a counterparty, and open it later in a way that prevents both
cheating by the committer and learning by the receiver. This guide treats
commitments as standalone primitives, surveys the main constructions (hash,
Pedersen, KZG, lattice, and specialized variants), and walks through the
security analysis and implementation choices an engineer or researcher needs to
make.

<!--more-->

## 1. introduction

### definition

A non-interactive commitment scheme over a message space $\mathcal{M}$ and a
randomness space $\mathcal{R}$ is a tuple of algorithms
$(\mathsf{Setup}, \mathsf{Commit}, \mathsf{Open})$:

- $\mathsf{Setup}(1^\lambda) \rightarrow \mathsf{pp}$ produces public parameters
  for a security parameter $\lambda$. Some schemes have no setup beyond the
  choice of a hash function; others require structured parameters.
- $\mathsf{Commit}_{\mathsf{pp}}(m; r) \rightarrow c$ takes a message
  $m \in \mathcal{M}$ and a randomizer $r \in \mathcal{R}$ and produces a
  commitment $c$.
- $\mathsf{Open}(c, m, r) \rightarrow \{0, 1\}$ checks that $(m, r)$ is a valid
  opening of $c$.

The protocol has two phases. In the **commit phase**, the sender publishes $c$.
In the **reveal phase**, the sender publishes $(m, r)$, and the receiver runs
$\mathsf{Open}$.

### the two security properties

A commitment scheme must satisfy two adversarial properties that pull in
opposite directions.

**Hiding** says that $c$ leaks nothing about $m$ before the reveal. Formally,
for any two messages $m_0, m_1 \in \mathcal{M}$, the distributions

$$
\{ \mathsf{Commit}_{\mathsf{pp}}(m_0; r) : r \leftarrow \mathcal{R} \}
\quad \text{and} \quad
\{ \mathsf{Commit}_{\mathsf{pp}}(m_1; r) : r \leftarrow \mathcal{R} \}
$$

are either statistically close (information-theoretic hiding) or computationally
indistinguishable (computational hiding).

**Binding** says that the sender cannot open $c$ to two different values. No
efficient adversary should produce $(m_0, r_0) \neq (m_1, r_1)$ with
$\mathsf{Commit}(m_0; r_0) = \mathsf{Commit}(m_1; r_1)$. Again, the property
comes in two flavours: information-theoretic (no such pair exists, even with
unbounded computation) and computational (no such pair can be found in
polynomial time).

A classical impossibility result rules out schemes that are both perfectly
hiding and perfectly binding at the same time. The argument is short: if
$\mathsf{Commit}$ is perfectly hiding, then a given $c$ has openings to every
message $m$, so an unbounded adversary can equivocate. Designers must therefore
choose which flavour to make information-theoretic.

### the commitment game

The standard hiding game is the indistinguishability experiment
$\mathsf{HID}^{\mathcal{A}}_{\Pi}(\lambda)$:

1. Run $\mathsf{pp} \leftarrow \mathsf{Setup}(1^\lambda)$ and hand $\mathsf{pp}$
   to the adversary $\mathcal{A}$.
2. $\mathcal{A}$ outputs two messages $m_0, m_1 \in \mathcal{M}$.
3. The challenger samples a bit $b \leftarrow \{0,1\}$ and a randomizer
   $r \leftarrow \mathcal{R}$, then sends $c = \mathsf{Commit}(m_b; r)$.
4. $\mathcal{A}$ outputs a guess $b'$. The adversary wins if $b' = b$.

The scheme is hiding if no probabilistic polynomial-time adversary wins with
non-negligible advantage over $1/2$.

The binding game $\mathsf{BIND}^{\mathcal{A}}_{\Pi}(\lambda)$ asks $\mathcal{A}$
to output $(c, m_0, r_0, m_1, r_1)$ with $m_0 \neq m_1$ such that both openings
verify. Binding holds if no probabilistic polynomial-time adversary wins with
non-negligible probability.

### trapdoor randomness

Many algebraic schemes are built on top of a trapdoor. A trapdoor is a piece of
secret information about $\mathsf{pp}$ that, if known, lets a party equivocate
(open a commitment to different messages). Pedersen commitments provide a clean
example: if the prover knows the discrete logarithm $x = \log_g h$, then any
commitment can be opened to any message by adjusting the randomizer.

Trapdoors are not a flaw; they are a feature. Simulation-based security proofs
in zero-knowledge protocols routinely give the simulator access to a trapdoor so
it can produce commitments that look like real ones and open them later in
whatever way the proof requires. The same trapdoor must remain unknown to the
real prover; this is the role of the trusted setup.

## 2. the landscape of commitment constructions

### a. hash-based commitments

The simplest construction uses a cryptographic hash function $H$:

$$
\mathsf{Commit}(m; r) = H(m \,\|\, r), \qquad r \leftarrow \{0,1\}^\lambda.
$$

**Hardness assumptions.** Binding reduces to collision resistance of $H$:
finding two openings is exactly finding a collision. Hiding reduces, in the
random oracle model, to the unpredictability of $H$'s output on inputs unknown
to the adversary. In the standard model, hiding requires a stronger assumption
on $H$ (such as being a pseudorandom function under an appropriate keying).

**Properties.** Binding is computational (under collision resistance), and
hiding is computational (in the random oracle model). The scheme is not
homomorphic.

**Pros.** Cheap, post-quantum if $H$ is (Grover only halves the security level),
and standardisable with any approved hash.

**Cons.** No algebraic structure to exploit. The well-known **small message
space attack** matters here: if $\mathcal{M}$ is small enough that an attacker
can enumerate it, omitting $r$ (or using a short $r$) breaks hiding, since the
attacker can compute $H(m')$ for every candidate $m'$ and compare. The
mitigation is to use a high-entropy randomizer of at least $\lambda$ bits.

**Applications.** Sealed-bid auctions where each bidder publishes
$H(\mathsf{bid} \,\|\, r)$ in advance and reveals after the deadline;
coin-flipping over a channel; Merkle-tree leaf commitments in authenticated-data
structures.

### b. pedersen commitments

Let $\mathbb{G}$ be a cyclic group of prime order $q$ with generators $g$ and
$h$ such that $\log_g h$ is unknown to all parties. The Pedersen scheme defines

$$
\mathsf{Commit}(m; r) = g^m \cdot h^r, \qquad m, r \in \mathbb{Z}_q.
$$

**Hardness assumption.** Binding reduces to the discrete-logarithm problem in
$\mathbb{G}$: from two openings $(m_0, r_0) \neq (m_1, r_1)$ of the same $c$,
one extracts $\log_g h = (m_0 - m_1)(r_1 - r_0)^{-1} \bmod q$. Hiding is
information-theoretic because for any $m$ the value $g^m h^r$ is uniformly
distributed in $\mathbb{G}$ when $r$ is uniform in $\mathbb{Z}_q$.

**Properties.** Perfect (information-theoretic) hiding and computational binding
under discrete log.

**Homomorphism.** Pedersen commitments are additively homomorphic:

$$
\mathsf{Commit}(m_1; r_1) \cdot \mathsf{Commit}(m_2; r_2)
= g^{m_1 + m_2} h^{r_1 + r_2}
= \mathsf{Commit}(m_1 + m_2; r_1 + r_2).
$$

This makes Pedersen the workhorse of protocols that need to prove linear
relations on committed values without opening them.

**Trusted setup.** The generators $g$ and $h$ must be sampled so that no one
learns $\log_g h$. A common technique is to derive $h$ from $g$ via a
nothing-up-my-sleeve hash-to-curve construction, which removes the need for an
interactive ceremony.

**Applications.** Range proofs (Bulletproofs), multi-party computation protocols
that exchange shares of secret values, electronic voting where ballots are
encoded as Pedersen commitments to candidate indices, and the construction of
$\Sigma$-protocols for relations over committed witnesses.

### c. kzg polynomial commitments

Kate, Zaverucha, and Goldberg (KZG) extend the commitment idea from scalars to
polynomials. Let $e : \mathbb{G}_1 \times \mathbb{G}_2 \rightarrow
\mathbb{G}_T$
be a bilinear pairing of prime order $q$, with generators $g_1
\in \mathbb{G}_1$
and $g_2 \in \mathbb{G}_2$. A trusted setup samples a secret
$\tau \in \mathbb{Z}_q$ and publishes the structured reference string

$$
\mathsf{srs} = \big( g_1, g_1^{\tau}, g_1^{\tau^2}, \dots, g_1^{\tau^d},\;
g_2, g_2^{\tau} \big).
$$

The trapdoor $\tau$ must be destroyed.

To commit to a polynomial $p(X) = \sum_{i=0}^{d} a_i X^i$, the prover computes

$$
C = g_1^{p(\tau)} = \prod_{i=0}^{d} (g_1^{\tau^i})^{a_i}.
$$

The commitment is a single group element, regardless of $d$.

**Evaluation proofs.** To prove that $p(z) = y$, the prover computes the
quotient polynomial $q(X) = (p(X) - y)/(X - z)$ and outputs the witness
$\pi = g_1^{q(\tau)}$. The verifier accepts iff

$$
e\big( C \cdot g_1^{-y},\; g_2 \big)
= e\big( \pi,\; g_2^{\tau} \cdot g_2^{-z} \big).
$$

**Hardness assumption.** Binding relies on the $d$-strong Diffie-Hellman
assumption (or a related $q$-type assumption). Hiding is computational under the
same family. A randomized variant, where the prover commits to
$p(X) +
r \cdot Z(X)$ for a public vanishing polynomial $Z$, adds statistical
hiding.

**Properties.** Constant-size commitment and constant-size evaluation proofs.
Linearly homomorphic in the underlying polynomial.

**Trusted setup nuances.** The setup is **universal**: a single ceremony
produces parameters for any polynomial up to degree $d$. It is also
**updatable**: any party can contribute fresh randomness so the resulting $\tau$
is unknown as long as at least one contributor was honest.

**Applications.** Verifiable computation over committed data, succinct proof
systems for arithmetic circuits, accumulators for set membership, and any
protocol where a verifier needs to check evaluations of a hidden function at
adversarially chosen points.

### d. lattice-based commitments

Schemes based on the **short integer solution** (SIS) and **learning with
errors** (LWE) problems give commitments believed to resist quantum adversaries.

A canonical SIS-based construction works in $\mathbb{Z}_q^{n \times k}$ for
parameters $n, k, q$. Sample a public matrix $A \in \mathbb{Z}_q^{n \times
k}$.
To commit to a short message $m \in \{0,1\}^{k_1}$ with randomness
$r \in \{0,1\}^{k_2}$ (where $k_1 + k_2 = k$),

$$
\mathsf{Commit}(m; r) = A \cdot \binom{m}{r} \bmod q.
$$

Binding follows from the hardness of finding short vectors in the kernel of $A$:
two valid openings differ by a short vector in $\ker(A)$, which is exactly an
SIS solution. Hiding follows from the leftover hash lemma when $r$ has enough
entropy.

LWE-based variants commit to $m$ as $c = A r + 2 e + m$ with $r$ uniform, $e$ a
short error vector, and $m$ encoded in a coset. Such schemes inherit the
additive homomorphism of LWE ciphertexts.

**Properties.** Computational binding under SIS, statistical hiding under the
leftover hash lemma (or computational hiding under LWE). Additively homomorphic
over short messages.

**Trade-offs.** Commitments are vectors of dimension $n$ over $\mathbb{Z}_q$
rather than a single group element; sizes are typically in the kilobytes range
rather than tens of bytes. The schemes use module-lattice variants (over rings
like $\mathbb{Z}_q[X]/(X^N + 1)$) to keep sizes manageable.

**Applications.** Post-quantum versions of $\Sigma$-protocols, post-quantum
signatures (the same algebra underpins constructions in the Dilithium and Falcon
families), and post-quantum succinct proof systems built on ideal lattices.

### e. advanced and specialized schemes

**Fujisaki-Okamoto commitments.** Over an RSA-style composite-order group
$\mathbb{Z}_N^*$ with elements $g, h$ of large order, commit by
$c = g^m h^r \bmod N$. The scheme commits to messages of arbitrary integer size
(not just elements of $\mathbb{Z}_q$) and supports zero-knowledge proofs that
the committed value lies in a public interval. Used in range-proof-heavy
protocols.

**Vector commitments.** A vector commitment lets a prover commit to
$(m_1, \dots, m_n)$ and later open any single position with a short proof.
Constructions include Merkle trees (succinct but logarithmic-size proofs) and
pairing-based vector commitments such as the construction of Catalano and Fiore
(constant-size proofs, with linear-size public parameters). Polynomial
commitments such as KZG yield vector commitments by interpolating $m_i$ as
$p(i)$.

**Time-lock commitments.** A time-lock commitment, in the style of Rivest,
Shamir, and Wagner, forces the receiver to perform sequential computation before
learning $m$. The construction relies on repeated squaring modulo an RSA modulus
$N = p q$: the committer encrypts $m$ with a key $k = g^{2^T}
\bmod N$, where $T$
is a time parameter. Knowing $p$ and $q$ lets the committer compute $k$ quickly
via Euler's theorem; everyone else must perform $T$ sequential squarings. The
primitive enables fair-exchange protocols and timed-release auctions.

**Homomorphic commitments on pairing-friendly curves.** Beyond Pedersen and KZG,
schemes built on bilinear groups support more structured operations: commitments
to group elements rather than scalars, commitments compatible with Groth-Sahai
non-interactive zero-knowledge proofs, and structure- preserving commitments
useful in modular protocol design.

## 3. comparative analysis

The table below summarizes the trade-offs across the families.

| Scheme           | Hiding        | Binding       | Homomorphic | Assumption          | Quantum-Resistant | Typical Use Case                   |
| ---------------- | ------------- | ------------- | ----------- | ------------------- | ----------------- | ---------------------------------- |
| Hash-based       | Computational | Computational | No          | CR + ROM            | Yes (with margin) | Sealed-bid auctions, coin flip     |
| Pedersen         | Perfect       | Computational | Yes (add.)  | Discrete log        | No                | MPC, voting, range proofs          |
| KZG              | Computational | Computational | Yes (poly)  | $d$-strong DH       | No                | Verifiable computation, SNARKs     |
| Lattice (SIS)    | Statistical   | Computational | Yes (add.)  | SIS                 | Yes               | Post-quantum ZK, PQ signatures     |
| Lattice (LWE)    | Computational | Computational | Yes (add.)  | LWE                 | Yes               | Post-quantum homomorphic protocols |
| Fujisaki-Okamoto | Statistical   | Computational | Yes (add.)  | Strong RSA          | No                | Range proofs over integers         |
| Vector (Merkle)  | Computational | Computational | No          | CR                  | Yes (with margin) | Authenticated data structures      |
| Vector (pairing) | Computational | Computational | Partial     | $q$-type pairing    | No                | Stateless authentication           |
| Time-lock (RSW)  | Computational | Computational | No          | Sequential squaring | Partial           | Timed-release, fair exchange       |

A few observations are worth making explicit. First, Pedersen and KZG choose to
make hiding (rather than binding) information-theoretic; this is the right
choice when a future cryptanalytic break on the binding assumption would only
affect commitments made after the break, while a break on hiding would
retroactively expose every commitment ever made. Hash-based schemes typically
make the opposite choice. Second, the homomorphism column is load-bearing for
protocol design: schemes without algebraic structure cannot participate in
proofs of linear relations without an extra layer (such as a SNARK or a Merkle
inclusion proof).

## 4. security analysis and attack vectors

### randomness source

Every commitment except deterministic ones depends on a random $r$. If $r$ comes
from a weak source, hiding collapses. The threat model includes biased or
predictable random number generators, virtual-machine clones that replay the
same seed, and embedded devices with poor entropy at boot. The mitigation is to
use a cryptographically secure pseudorandom generator seeded by an OS-provided
entropy source, and to never reuse $r$ across commitments.

### the small message space attack

Hash-based commitments without sufficient randomness are vulnerable to
exhaustive search. If a voting protocol commits to a candidate index
$c \in \{0, 1, 2, 3\}$ as $\mathsf{Commit}(c) = H(c)$, an observer can hash all
four candidates and recover $c$. The fix is to include a fresh high-entropy
randomizer: $H(c \,\|\, r)$ with $|r| \geq \lambda$.

A subtler variant occurs in Pedersen-style schemes when the message space itself
is small and the protocol leaks side information. If a prover commits to a bit
but later uses the commitment in a relation that constrains the message, an
attacker may distinguish the two possible messages by examining the surrounding
transcript rather than the commitment in isolation.

### the trusted setup attack

KZG and Fujisaki-Okamoto rely on parameters that must be generated honestly. If
the trapdoor $\tau$ (KZG) or the factorization $N = p q$ (Fujisaki-Okamoto) is
known to an attacker, binding is broken: the attacker can produce a commitment
and open it to whatever value they choose.

Mitigations include:

- **Nothing-up-my-sleeve construction.** Derive parameters deterministically
  from a public seed via a hash-to-curve or similar procedure.
- **Multi-party computation ceremonies.** Run the setup as an MPC where the
  trapdoor is the joint secret of many participants. As long as one participant
  is honest, the trapdoor remains unknown.
- **Updatable setups.** KZG's structure allows any party to refresh the
  parameters by contributing fresh randomness, so the ceremony can be extended
  over time.

### quantum threats

Shor's algorithm breaks the discrete-logarithm and integer-factorisation
problems in polynomial time on a sufficiently large quantum computer. This
affects Pedersen, KZG, Fujisaki-Okamoto, and any other scheme whose binding or
hiding rests on those problems.

The asymmetry between hiding and binding matters here. For Pedersen:

- **Binding** (computational, under discrete log) is **broken** by Shor: a
  quantum adversary can compute $\log_g h$ and equivocate.
- **Hiding** (information-theoretic) is **unaffected**: no amount of computation
  lets an adversary distinguish commitments.

For hash-based commitments, Grover's algorithm gives a quadratic speedup against
pre-image search; doubling the output length of $H$ restores the intended
security level. Binding under collision resistance survives in the quantum
setting up to a similar polynomial overhead.

For lattice schemes, no quantum algorithm is known that breaks SIS or LWE
substantially faster than classical algorithms, modulo ongoing research on the
dihedral hidden subgroup problem and related approaches.

### side-channel attacks

Implementations leak through timing, power, electromagnetic emissions, and cache
behaviour. The randomness sampling step is a frequent source of leakage: a
non-constant-time rejection sampler can reveal bits of $r$. Scalar
multiplication in Pedersen and pairing computation in KZG must be implemented to
avoid data-dependent branches and memory accesses. For lattice schemes, the
small coefficients used as randomness require constant- time Gaussian or uniform
samplers.

## 5. implementation considerations for engineers

### choosing the right scheme

The first question is whether the protocol needs homomorphism. A protocol that
does nothing but commit and later reveal can use a hash-based scheme; this
minimises assumptions and code surface. A protocol that proves linear relations
on hidden values benefits from Pedersen. A protocol that handles large committed
data with succinct openings calls for KZG or another polynomial commitment. A
protocol that must remain secure against future quantum adversaries pushes the
choice towards lattice-based constructions, with the size penalty that implies.

The second question is the trust model. Schemes with a trusted setup require a
ceremony or a deterministic parameter-derivation method; this is operational
work that hash-based and Pedersen-style (with hash-to-curve) constructions
avoid.

### handling the trapdoor securely

The randomizer $r$ is the trapdoor of an individual commitment: with it, the
receiver verifies the opening; without it, even the committer cannot open.
Engineers should:

- Generate $r$ inside the same process that constructs the commitment, using a
  CSPRNG seeded by the OS.
- Treat $r$ as secret material: zero it from memory after use, avoid serializing
  it to logs, and store it under the same protections as a private key.
- Never reuse $r$ across commitments to different messages; this immediately
  breaks hiding for additively homomorphic schemes.

### serialization and canonicalisation

A commitment is binding only as a bitstring; if two encodings of the same group
element are accepted by the verifier, an attacker can mount a malleability
attack. Use canonical encodings: compressed point form on elliptic curves, fixed
byte order, and explicit rejection of non-canonical or non-reduced
representations. The same caution applies to messages: if the message space is
"any byte string", the protocol should commit to a length-prefixed encoding to
avoid extension attacks.

### libraries and standards

There is no single standardised commitment API in the way TLS standardises
encryption suites. Engineers typically build commitments on top of a
general-purpose cryptography library. Hash-based commitments use the project's
chosen hash (BLAKE3, SHA-256, SHA-3). Pedersen commitments use elliptic-curve
libraries; many modern libraries expose hash-to-curve operations that simplify
generator derivation. KZG implementations are available in proof-system
libraries that ship pairing-friendly curves such as BLS12-381. Lattice
constructions are still less standardised but appear in research libraries that
accompany NIST post-quantum candidates.

## 6. future directions

### post-quantum commitments

The migration to post-quantum primitives is the most pressing direction. NIST's
post-quantum standardisation has produced standards for key encapsulation and
signatures; commitments built on the same algebraic foundations (module-lattice
problems, hash functions, isogenies) are following. Hash-based commitments need
no migration beyond hash-output sizing; algebraic schemes need new
constructions.

### succinct arguments and polynomial commitments

Polynomial commitments are the backbone of modern succinct argument systems.
Active areas of research include:

- **Transparent polynomial commitments.** Schemes that avoid trusted setup
  entirely, such as constructions based on hash functions (FRI) or on groups of
  unknown order. These trade larger proofs for a simpler trust model.
- **Folding schemes.** Constructions that aggregate many polynomial commitments
  into one, enabling incrementally verifiable computation without recursion
  through a SNARK.
- **Multilinear commitments.** Generalisations of KZG to multilinear
  polynomials, useful in sum-check-based proof systems.

### standardisation

Beyond NIST's post-quantum work, the IETF Crypto Forum Research Group has
discussed standardising primitives that underpin commitment-heavy protocols,
including hash-to-curve, verifiable random functions, and threshold signatures.
A dedicated commitment standard does not yet exist; in the meantime, protocol
designers should document their commitment construction precisely, including the
choice of curve, encoding, and parameter derivation, so that interoperability
and review are possible.

## references

- T. P. Pedersen. _Non-interactive and information-theoretic secure verifiable
  secret sharing._ CRYPTO 1991.
- A. Kate, G. M. Zaverucha, I. Goldberg. _Constant-size commitments to
  polynomials and their applications._ ASIACRYPT 2010.
- E. Fujisaki, T. Okamoto. _Statistical zero knowledge protocols to prove
  modular polynomial relations._ CRYPTO 1997.
- M. Ajtai. _Generating hard instances of lattice problems._ STOC 1996. (Origin
  of SIS.)
- O. Regev. _On lattices, learning with errors, random linear codes, and
  cryptography._ JACM 2009.
- R. L. Rivest, A. Shamir, D. A. Wagner. _Time-lock puzzles and timed- release
  crypto._ MIT/LCS/TR-684, 1996.
- D. Catalano, D. Fiore. _Vector commitments and their applications._ PKC 2013.
- J. Groth, A. Sahai. _Efficient non-interactive proof systems for bilinear
  groups._ EUROCRYPT 2008.
- NIST Post-Quantum Cryptography Standardisation,
  <https://csrc.nist.gov/projects/post-quantum-cryptography>.
