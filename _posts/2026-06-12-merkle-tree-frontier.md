---
layout: post
title: "The frontier: storing an append-only Merkle tree in O(log n)"
date: 2026-06-12 00:00:00 +0000
author: Danny Willems
tags: [cryptography, merkle-tree, zcash, ethereum, data-structures]
---

The frontier of an append-only Merkle tree is the minimal slice of the tree you
have to keep in order to append new leaves and recompute the root, without
storing the whole tree. It is the tree's rightmost edge: the last leaf that was
added, plus a small set of already-computed subtree hashes. For a tree of depth
$d$ it costs $O(d)$ memory instead of $O(n)$, so a depth-32 tree needs about 32
hashes regardless of whether it holds one leaf or four billion.

<!--more-->

This article was written with the help of an AI assistant, working from my own
notes and the primary sources linked at the end. Mentioning it does not exempt
the claims below from scrutiny; if something looks wrong, check the references.
This post is primarily a note to myself to keep this technique written down
somewhere I can find it again.

## The setting: append-only Merkle trees

A Merkle tree of fixed depth $d$ has $2^d$ leaf slots. Leaves are filled left to
right, one at a time, and never modified once written. After each append we want
two things:

- the current **root** hash, which commits to all leaves added so far;
- the ability to **append** the next leaf cheaply.

The naive approach stores every node and recomputes the affected path on each
append. Storing the whole tree is $O(n)$ in the number of leaves, which is the
problem: these trees are used in systems where $n$ reaches into the millions
(Zcash note commitments) or is bounded only by $2^{32}$ (the Ethereum deposit
contract). You do not want to hold all of that in memory or on chain.

The observation that makes this cheap: to compute the root and to append, you do
not need the interior of the tree. You only need its right edge.

## Why only the right edge matters

Consider what an append touches. A new leaf goes into the leftmost empty slot.
Computing the new root means hashing that leaf up to the root, pairing it at
each level with its sibling. There are two kinds of siblings:

- **Left siblings** that already exist. These are the roots of complete subtrees
  sitting to the left of the insertion path. Their values are already fixed and
  will never change again, because nothing to their left will ever be modified.
- **Right siblings** that do not exist yet. Every slot to the right of the new
  leaf is empty, so the right sibling at each level is the root of an _empty_
  subtree, a constant that depends only on the level.

So the only tree-dependent data an append needs is the set of left-sibling
subtree roots on the path from the current tip up to the root. That set is the
frontier. Everything strictly to its left has been collapsed into one hash per
level; everything to its right is a known constant.

## Definition

A frontier of a non-empty append-only Merkle tree is the triple:

$$
\text{frontier} = (\text{position},\ \text{leaf},\ \text{ommers})
$$

where:

- **position** is the index of the most recently appended leaf (0-based);
- **leaf** is the value of that most recently appended leaf;
- **ommers** is the list of left-sibling subtree roots described above, ordered
  from the bottom of the tree upward.

The word "ommer" is the gender-neutral term for "sibling of a parent" (aunt or
uncle). In this structure the ommers are exactly the subtree roots that will
become siblings as the tip leaf is hashed toward the root.

This is the definition used by the Zcash `incrementalmerkletree` crate, whose
`NonEmptyFrontier<H>` struct has precisely these three fields:
[frontier.rs](https://github.com/zcash/incrementalmerkletree/blob/main/incrementalmerkletree/src/frontier.rs).

The number of ommers is not $n$. It is the number of 1-bits in the binary
representation of the leaf count, which is at most $d$. A tree holding $2^d - 1$
leaves has at most $d$ ommers.

## A worked example

Take a depth-3 tree (8 leaf slots) and append leaves $L_0, L_1, \dots$ one at a
time. Write $H(a, b)$ for the hash of two child nodes, and let internal nodes be
named by the leaves they cover, so $H(0..3)$ is the root of the subtree over
$L_0, L_1, L_2, L_3$.

After appending **5 leaves** ($L_0 \dots L_4$, position 4), the tree looks like
this on its left half (full) and right half (empty):

```
                    root
              /            \
         H(0..3)          H(4..7)   <- right half mostly empty
         /     \          /     \
     H(0,1)  H(2,3)    H(4,5)   (empty)
      / \     / \       / \
    L0  L1  L2  L3    L4 (empty)
```

The frontier after this append is:

- position = 4
- leaf = $L_4$
- ommers = $[\,H(0..3)\,]$

That single ommer, $H(0..3)$, summarizes leaves $L_0$ through $L_3$. The four
leaves themselves are gone from the frontier; they have been collapsed into one
hash. Note that $L_4$ has no completed left sibling below $H(0..3)$ yet, because
its own subtree on the right is still being filled, which is why there is
exactly one ommer.

To compute the root from this frontier:

$$
\text{root} = H\big(\,H(0..3),\ H(\,H(L_4, E_0),\ E_1\,)\,\big)
$$

where $E_0$ is the empty-leaf hash and $E_1 = H(E_0, E_0)$ is the empty-subtree
root one level up. The left child $H(0..3)$ comes from the ommer; the right
child is built entirely from the tip leaf and empty-subtree constants.

Now **append $L_5$** (position 5). $L_5$ lands as a right child of the node
above $L_4$, so $L_4$ becomes a completed left sibling at level 0. The new
frontier is:

- position = 5
- leaf = $L_5$
- ommers = $[\,L_4,\ H(0..3)\,]$

Only one entry was added, and no existing entry changed. This "touch one slot
per append" property is the practical payoff.

## The append algorithm

In pseudo-code, an append distinguishes the two cases above: the new leaf is
either a right child (cheap) or a left child (a carry chain up the tree).

```
function append(frontier, new_leaf):
    frontier.position += 1
    old_leaf = frontier.leaf
    frontier.leaf = new_leaf

    if frontier.position is a right child:      # new index is odd
        # old leaf becomes a level-0 left sibling; nothing else changes
        frontier.ommers.prepend(old_leaf)
        return

    # new index is even: hash complete subtrees together, carrying up
    # until we reach a level whose left-sibling slot is empty
    carry = old_leaf
    level = 0
    new_ommers = []
    for (node, source) in path_from(old_position) up to new_root_level:
        if source is an existing ommer at this level:
            if carry is at this level:
                carry = H(level, ommer_value, carry)   # combine and keep carrying
                level += 1
            else:
                new_ommers.append(carry)
                new_ommers.append(ommer_value)
                carry = none
        # right-side / future nodes contribute nothing to the stored ommers
    if carry is not none:
        new_ommers.append(carry)
    frontier.ommers = new_ommers
```

This mirrors `NonEmptyFrontier::append` in the Zcash crate. The right-child case
is the single line `self.ommers.insert(0, prior_leaf)`; the left-child case is
the carry loop. See
[frontier.rs `append`](https://github.com/zcash/incrementalmerkletree/blob/main/incrementalmerkletree/src/frontier.rs).

The Ethereum 2.0 deposit contract expresses the same logic even more compactly.
It keeps an array `branch` (the ommers) of length $d$ and a `deposit_count`.
Each deposit walks up from the new leaf, and the loop stops at the first level
where the count has a 0-bit, writing a single new value into `branch`. The eth2
book walks through it line by line:
[The Deposit Contract](https://eth2book.info/latest/part2/deposits-withdrawals/contract/).

## Computing the root

The root folds the tip leaf upward, combining with an ommer on the left where
one exists and with an empty-subtree root on the right where the tree is not yet
filled.

```
function root(frontier, depth):
    digest = frontier.leaf
    level = 0
    for each level up to depth:
        if there is an ommer at this level (a completed left sibling):
            digest = H(level, ommer_at(level), digest)   # ommer on the left
        else:
            digest = H(level, digest, empty_root(level))  # empty subtree on the right
        level += 1
    return digest
```

This matches `NonEmptyFrontier::root`, which classifies each level as
`Source::Past(i)` (combine with `ommers[i]` on the left) or `Source::Future`
(combine with `empty_root` on the right). See
[frontier.rs `root`](https://github.com/zcash/incrementalmerkletree/blob/main/incrementalmerkletree/src/frontier.rs).
The empty-subtree roots are a precomputed table: $E_0$ is the empty-leaf hash
and $E_{k+1} = H(E_k, E_k)$, so there are only $d$ of them.

## Complexity

For a tree of depth $d$ holding up to $n = 2^d$ leaves:

| Operation                | Naive full tree                       | Frontier       |
| ------------------------ | ------------------------------------- | -------------- |
| Memory                   | $O(n)$                                | $O(d)$         |
| Append                   | $O(d)$                                | $O(d)$         |
| Recompute root           | $O(n)$ or $O(d)$ with stored interior | $O(d)$         |
| Nodes written per append | up to $d$                             | 1 stored ommer |

Concretely, at depth 32 with a 32-byte hash, the frontier is at most
$32 \times 32 = 1024$ bytes, independent of how many leaves have been appended.
That bound is why the Ethereum deposit contract can support $2^{32}$ deposits
while keeping only 32 words of state.

## Where this is used, and what it is called

The same data structure appears under several names. The shared core (keep the
rightmost path, append by touching one node, recompute the root against empty
subtrees) is identical; the vocabulary differs by project.

- **Zcash: "frontier".** The `incrementalmerkletree` crate is the canonical Rust
  implementation, used for the Sapling and Orchard note commitment trees. Repo:
  [zcash/incrementalmerkletree](https://github.com/zcash/incrementalmerkletree).
  Design notes in the Zebra book:
  [Tree States](https://zebra.zfnd.org/dev/rfcs/0007-treestate.html).
- **Ethereum 2.0 deposit contract: "branch".** The most-studied version of this
  algorithm. It has a machine-checked correctness proof in Dafny (Cassez,
  "Verification of the Incremental Merkle Tree Algorithm with Dafny", FM 2021):
  [arXiv:2105.06009](https://arxiv.org/abs/2105.06009),
  [Consensys/deposit-sc-dafny](https://github.com/Consensys/deposit-sc-dafny). A
  readable explainer:
  [Eth2.0 Deposit Merkle Tree](https://medium.com/@josephdelong/ethereum-2-0-deposit-merkle-tree-13ec8404ca4f).
- **Certificate Transparency / history trees.** Append-only Merkle logs that
  maintain the tree head from the same right-edge state. See RFC 6962 and Crosby
  and Wallach, "Efficient Data Structures for Tamper-Evident Logging" (USENIX
  Security 2009).
- **Merkle Mountain Range (MMR).** A close relative used by OpenTimestamps and
  Grin. An MMR tracks the "peaks" of a forest of perfect subtrees; those peaks
  are essentially the same left-of-tip subtree roots that the frontier calls
  ommers.

In my view the "frontier" framing is the clearest of these, because the name
states what the structure is: the moving boundary between the part of the tree
that is fixed and the part that does not exist yet.

## Beyond the root: witnesses

The frontier as described here is enough to maintain the root. The Zcash crate
goes further: it keeps incremental, "fast-forwarding" witnesses, meaning
authentication paths for many leaves at once, with pruning and checkpoints
(`bridgetree` and `shardtree`). That witness machinery is the part that is more
particular to Zcash and is where the implementation grows past the textbook
deposit-contract algorithm. The crate README summarizes it as "an append-only
merkle tree which is always pruned, along with incremental, fast-forwarding
witnesses". The frontier is the foundation that all of it is built on.

## References

- Zcash `incrementalmerkletree` crate:
  <https://github.com/zcash/incrementalmerkletree>
- `frontier.rs` source (the `NonEmptyFrontier` struct, `append`, `root`):
  <https://github.com/zcash/incrementalmerkletree/blob/main/incrementalmerkletree/src/frontier.rs>
- Zebra book, Tree States: <https://zebra.zfnd.org/dev/rfcs/0007-treestate.html>
- eth2 book, The Deposit Contract:
  <https://eth2book.info/latest/part2/deposits-withdrawals/contract/>
- Cassez, Verification of the Incremental Merkle Tree Algorithm with Dafny (FM
  2021): <https://arxiv.org/abs/2105.06009>
- ConsenSys Dafny proof: <https://github.com/Consensys/deposit-sc-dafny>
- Runtime Verification, Formal Verification of the Eth2.0 Deposit Contract:
  <https://runtimeverification.com/blog/formal-verification-of-ethereum-2-0-deposit-contract-part-1>
- Crosby and Wallach, Efficient Data Structures for Tamper-Evident Logging
  (USENIX Security 2009):
  <https://www.usenix.org/legacy/event/sec09/tech/full_papers/crosby.pdf>
