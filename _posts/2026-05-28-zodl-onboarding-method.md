---
layout: post
title: A new onboarding method, applied to the Zcash stack at ZODL
date: 2026-05-28 00:00:00 +0000
author: Danny Willems
tags: [onboarding, zcash, zodl, claude-code, documentation, zk]
---

I recently started at [ZODL](https://zodl.com/), where my work focuses on the
Zcash protocol and its surrounding Rust ecosystem. Joining a project of this
size raises the usual question: how do you get from "cloning the repo" to
"opening a useful PR" without spending weeks reading code top to bottom?

For this position, I am trying a new onboarding method, and I plan to keep the
resulting documents up to date over the months and years to come. This post is a
short note on what the method is and where the current outputs live.

## the problem

The Zcash stack spans several large Rust repositories: a node, a wallet library
suite, a proving system, and the circuits that encode the shielded protocols
(Sprout, Sapling, and Orchard). Each repo has its own conventions, its own test
layout, its own CI gates, and its own relationship to the Zcash specification
(the ZIPs). The amount of code is large enough that linear reading does not
scale, and small enough that skipping context leads to PRs that miss invariants.

What I wanted was a per-repo document that:

- points to specific files and line ranges rather than paraphrasing them,
- states the math (fields, curves, commitments, circuits) before connecting it
  to the code,
- includes exercises that touch the code, not just questions about it,
- can be regenerated as the upstream repos evolve.

I also wanted a sense of the history. Code is often the end product of a much
broader context: design discussions on forums, GitHub issues and PRs, ZIPs and
their drafts, audit reports, retired proposals, mailing list threads. Reading
only the current source hides the reasons behind a given choice, and makes it
harder to tell which invariants are load-bearing and which are accidents. AI
tools make it tractable to walk through that surrounding material across the
public Internet, summarize it, and link it back to the relevant lines of code,
which would otherwise take weeks of manual archaeology.

## the onboarding skill

To produce these documents, I use a Claude Code skill I wrote called
`onboard-repo`. The skill drives a discovery phase over the target repository
(build manifests, module graph, public API, tests, CI, release process), then
generates a Docusaurus site under `onboarding/` in the repo. The site is
deployed to GitHub Pages from a dedicated `onboarding` branch, so each repo
carries its own course next to its code.

A few operating principles the skill enforces:

- every prose claim about the codebase must point to a file with a line range,
  or be marked as an opinion;
- when a chapter touches a mathematical object, the formal definition comes
  before the code reference;
- exercises must be verifiable, either by a line range answer or by a code
  change that produces a passing or failing test.

The intent is operational. The output is meant to support writing PRs within
days of reading it, not just to read about the project.

## current documents

The following sites are the first batch generated for the Zcash stack. They are
works in progress and will evolve along with the upstream code:

- [zebra](https://dannywillems.github.io/zebra/): the Zcash full node
  implementation in Rust.
- [zcash](https://dannywillems.github.io/zcash/): the original C++ node, used
  here mostly as a reference for consensus rules.
- [orchard](https://dannywillems.github.io/orchard/): the Orchard shielded pool,
  including the Pallas curve, Sinsemilla commitments, and the circuit.
- [librustzcash](https://dannywillems.github.io/librustzcash/): the Rust
  workspace bundling wallet, key derivation, note encryption, and client
  backends.
- [halo2](https://dannywillems.github.io/halo2/): the proving system used by
  Orchard, with chapters on the IPA-based polynomial commitment scheme and the
  circuit API.

Each site has its own table of contents, exercises, and pointers to the relevant
ZIPs and papers. If a chapter feels too thin or a claim looks wrong, the
corresponding repo issue tracker is the right place to flag it.

## what comes next

I will treat these documents as living references rather than one-shot
write-ups. The plan is to rerun the skill periodically against the upstream
repositories, fold in corrections from real PR work, and add chapters for areas
I had to learn the hard way. If the experiment goes well, the same approach
should generalize to other large Rust codebases I touch in the future.

This article, and the onboarding sites it links to, were written with the help
of [Claude](https://www.anthropic.com/claude) (via Claude Code).
