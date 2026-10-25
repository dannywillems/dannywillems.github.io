---
layout: post
title: "Keeping AI agents goal-directed: a lemma-sprawl lesson from Lean"
date: 2026-06-20 09:00:00 +0200
author: Danny Willems
tags: [AI, Lean, formal-verification, theorem-proving, agents, workflow]
---

I spent a long session directing an AI coding agent to formalize a Rust
Merkle-tree library,
[zcash/incrementalmerkletree](https://github.com/zcash/incrementalmerkletree),
in Lean 4. The agent produced around 135 machine-checked lemmas with no `sorry`
and a green CI on two Lean toolchains. It never closed the one theorem the whole
exercise was for. This post is about that failure mode, why it happened, and
what keeps an AI agent pointed at a goal.

<!--more-->

## The setup

The plan had a clear centerpiece: prove that the efficient "frontier"
representation computes the same Merkle root as a naive reference tree (call it
the root theorem). Everything else, the addressing arithmetic, the hashing
model, the incremental append, was supposed to be in service of that theorem and
a few siblings.

The agent built a real, layered library: integer and bit-vector addressing, an
abstract hash, the reference root, the frontier model with its append-and-carry
logic, and a large supporting theory around population counts and spines. All of
it verified.

## The drift

After the first solid milestones I kept giving the same instruction: "continue
with multiple lemmas and theorems at the same time." The agent complied,
literally and well. Each turn it proved three or four more lemmas, built and
checked them on every toolchain, and committed. The commit count climbed. The
library grew broad and tidy.

The centerpiece did not move. The agent was working bottom-up, accumulating a
library, when the goal required working top-down from the target theorem. By the
time I asked it to justify why each lemma was needed, it admitted that a good
fraction were prerequisites of the goal or faithful modeling, but several were
breadth it had added because the instruction rewarded breadth.

In my view that is the important point. The instruction was a volume metric. An
agent optimizes the metric you give it. "More lemmas" is easy to satisfy without
ever touching the hard, narrow path to the result.

## Why it happens

A theorem-proving goal is a dependency graph with one root (the target) and a
small number of genuinely hard leaves. The cheap, safe, satisfying work is the
wide base of easy lemmas. An agent left to "keep producing" will flood the base,
because each easy lemma is a quick, verifiable, committable win, while the hard
leaves carry risk of not closing in a turn. Volume feels like progress and is
not.

This is not unique to AI. It is the formal-methods version of polishing the
parts of a project you already know how to do. The difference is that an agent
will do it tirelessly and at scale unless the goal is made explicit and binding.

## What keeps an agent directed

The fix that worked, once I saw the problem, was to stop measuring volume and
start measuring goal progress. Concretely:

- **Write the goal down as an artifact the agent must read.** I added a short
  `GOAL.md` with the ranked target theorems, a definition of done, and the
  specific open leaves blocking the target. The agent restates the target before
  working and checks each step against it.
- **Make the work demand-driven.** Prove a lemma only when the current proof of
  a target actually needs it. A `sorry` (a hole) in the target's proof is what
  licenses a new lemma; nothing else does.
- **Phrase instructions as goal-progress, not throughput.** "What is the next
  lemma the target proof needs?" or "make the target closer, and add nothing its
  proof does not require" beats "produce more lemmas."
- **Require a justification on every declaration.** Each definition and theorem
  carries a comment stating which target it serves. A lemma that cannot be
  justified probably should not exist.
- **Ask for a drift check.** "Restate the goal and tell me whether the last few
  commits moved it." If they did not, stop and replan.

None of this slows a capable agent down. It removes the cheap escape hatch of
breadth.

## What the field recommends

The practice that the formal-mathematics community has converged on is exactly
this discipline, under the name blueprint-driven formalization. A blueprint is
an explicit dependency graph: the required definitions, a curated list of
intermediate lemmas at the right granularity, and the final theorem that
composes them. You discharge the leaves and work upward; when the proof
assistant reveals that a step is mis-stated or split at the wrong granularity,
you revise the blueprint rather than pile on lemmas.

Terence Tao's write-up of the Polynomial Freiman-Ruzsa formalization is a
readable tour of the blueprint method, and there is a reusable project template
for it. Recent AI systems make the blueprint the literal system of record:
LeanMarathon describes "one blueprint that is at once a formal Lean skeleton, a
natural-language proof graph, and the shared system of record," discharged "from
its leaves upward in parallel, with coherence enforced by deterministic CI
gates." Numina-Lean-Agent and the SorryDB benchmark study the same loop of plan,
attempt, repair against compiler feedback.

A few more practices that helped in practice, drawn from working guidelines
rather than papers: plan the proof in natural language before writing tactics;
use the language server's live goal state instead of blind build cycles; keep a
hole (`sorry`) where you are not done and fill leaves top-down; search the
library before reproving a fact; and never trust a green build, because it
passes with holes in it.

## Takeaways

If you direct an AI agent on a proof or any goal with a hard, narrow critical
path:

- Give it a written goal and a definition of done, not a throughput target.
- Make new work demand-driven from that goal.
- Have it justify every artifact against the goal, and prune what it cannot.
- Check for drift by goal progress, not by output volume.

The agent in this story was not wrong to produce verified lemmas. I was wrong to
ask for volume. Once the goal was an artifact and the work was demand-driven,
the question each turn became "what does the target need next," which is the
only question that closes a theorem.

## Links

- [rot256: a Lean theorem-proving skill](https://github.com/rot256/skills/tree/master/lean)
- [Verified-zkEVM/clean: "Working on Lean proofs" guidance](https://github.com/Verified-zkEVM/clean/blob/main/AGENTS.md#working-on-lean-proofs)
- [Terence Tao: formalizing PFR in Lean 4 using Blueprint](https://terrytao.wordpress.com/2023/11/18/formalizing-the-proof-of-pfr-in-lean4-using-blueprint-a-short-tour/)
- [LeanProject: a blueprint-driven formalization template](https://github.com/pitmonticone/LeanProject)
- [LeanMarathon: long-horizon Lean autoformalization](https://arxiv.org/html/2606.05400)
- [Numina-Lean-Agent: agentic reasoning for formal mathematics](https://arxiv.org/pdf/2601.14027)
- [SorryDB: can AI provers complete real-world Lean theorems](https://arxiv.org/pdf/2603.02668)
- [lean-lsp-mcp: language-server access for AI agents](https://github.com/oOo0oOo/lean-lsp-mcp)
- [Lean4 as a safety net for AI (overview)](https://venturebeat.com/ai/lean4-how-the-theorem-prover-works-and-why-its-the-new-competitive-edge-in)
