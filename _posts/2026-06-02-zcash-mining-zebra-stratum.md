---
layout: post
title: "How Zcash mining fits together: the node, Stratum, and the mining stack"
date: 2026-06-02 00:00:00 +0000
author: Danny Willems
tags: [zcash, zebra, mining, stratum, equihash, zodl]
---

This post explains how a Zcash miner connects to the rest of the system: what a
full node like [Zebra](https://github.com/ZcashFoundation/zebra) actually
provides, what the Stratum protocol does, and what software production miners
run. It grew out of a question I had while working on the Zcash stack at
[ZODL](https://zodl.com/): if I want to mine on testnet, what command do I run?
The short answer is that there is no single command, because a node and a miner
are different programs with different jobs. Along the way it traces the relevant
paths in Zebra's source, with links pinned to the v4.5.1 release commit
(`76c440e6`) so the line numbers stay valid.

This article was written with the help of an AI assistant, working from my own
questions, the Zebra source code, and the web sources linked at the end. Treat
the profitability and market figures as the claims of their (often commercial)
sources, not as my recommendations. Numbers in this space change quickly.

<!--more-->

## a node is not a miner

Zebra is a Zcash validator node. It validates blocks and transactions, follows
the chain, and talks to peers. By default it does not mine, and there is no
`zebrad mine` subcommand: in a normal build, producing blocks is the job of
separate miner software. (Zebra does ship an experimental, opt-in internal miner
behind a build-time feature flag, which I cover near the end; the default binary
does not include it.)

What Zebra provides to miners is a JSON-RPC method called `getblocktemplate`.
This method hands back everything needed to assemble a candidate block: the
previous block hash, the set of transactions to include, the coinbase
transaction, the current target, and the valid time range. A miner takes that
template, searches for a proof of work that meets the target, and submits the
completed block back to the node, which then broadcasts it.

So the division of labour is:

- the node (`zebrad`) decides what a valid block looks like and serves
  templates,
- the miner does the proof-of-work search,
- something in between distributes work to many miners and aggregates their
  results.

That "something in between" is a mining pool, and the protocol it speaks to
miners is Stratum.

## what Stratum is

Stratum is the network protocol between mining hardware and a mining pool. It
exists because the node's `getblocktemplate` RPC is too heavy for thousands of
miners to poll directly, and because a single miner rarely finds a full block on
its own. Stratum lets a pool hand out small, measurable units of work and pay
miners for the work they demonstrably did.

The original protocol (sometimes called Stratum V1) is line-based JSON-RPC over
a plain TCP socket. That is the `stratum+tcp://host:port` address you configure
on a miner. A typical session looks like this:

1. The miner opens a long-lived TCP connection and subscribes
   (`mining.subscribe`), then authorizes a worker (`mining.authorize`, usually
   as `address.workername`).
2. The pool pushes work to the miner (`mining.notify`): the header fields to
   hash and a target.
3. The pool sets a _share difficulty_ that is much lower than the real network
   difficulty (`mining.set_target`). This is the key idea: it lets the pool
   measure each miner's contribution continuously, instead of waiting for the
   rare event of a full block.
4. The miner searches for solutions and submits any that meet the share
   difficulty (`mining.submit`). Most submitted shares are only proof that work
   was done. Occasionally a share also meets the real network target, and that
   one is the actual block the pool broadcasts.
5. The pool credits shares and pays out according to its scheme (PPS, PPS+, or
   PPLNS).

Stratum V1 was never standardized in a single RFC; the de facto reference is the
[Bitcoin Wiki's Stratum mining protocol page](https://en.bitcoin.it/wiki/Stratum_mining_protocol),
which documents `mining.subscribe`, `mining.notify`, `mining.submit`, and the
rest. Zcash does not use Bitcoin's Stratum verbatim. The original protocol bakes
in Bitcoin's block-header layout and nonce space, and Zcash's header format and
Equihash proof of work break those assumptions. Zcash therefore defines its own
variant in [ZIP 301: Zcash Stratum Protocol](https://zips.z.cash/zip-0301),
where, for instance, `mining.submit` carries the worker name, job id, time,
`nonce_2`, and the Equihash solution rather than Bitcoin's fields. ZIP 301 grew
out of the earlier
[slushpool Zcash Stratum protocol changes](https://github.com/slushpool/poclbm-zcash/wiki/Stratum-protocol-changes-for-ZCash).

Two properties matter. Stratum is push-based, so the pool notifies miners of new
work rather than miners polling for it. And the split between share difficulty
and network difficulty is what makes pooled mining low-variance and measurable.

Putting the pieces in order:

```
ASIC / GPU  --Stratum/TCP-->  pool stratum server  --getblocktemplate RPC-->  zebrad
```

There is also a newer redesign, [Stratum V2](https://stratumprotocol.org/),
which is binary, encrypted, and adds a mode that lets miners choose their own
transaction set rather than accepting the pool's; its specification is
maintained in the
[sv2-spec repository](https://github.com/stratum-mining/sv2-spec/tree/afae8e5439adfb8f6f65823bbe83afbd04abacf4).
Its production use so far has been mostly in Bitcoin. I did not find evidence of
meaningful Stratum V2 adoption in Zcash mining, so for Zcash the practical
protocol today is still V1.

## how a block is created and received, in Zebra's code

The conceptual flow above maps onto concrete code. This section traces it in
Zebra, with each reference pinned to the v4.5.1 commit so the line numbers do
not drift. Two RPC methods bracket the creation of a block, and a separate
network path handles receiving one from peers.

### creating a block: getblocktemplate and submitblock

A pool asks the node for work through the `getblocktemplate` RPC, implemented at
[`zebra-rpc/src/methods.rs:2217`](https://github.com/ZcashFoundation/zebra/blob/76c440e67f2c909cbf8418b11a3f56371aed7d95/zebra-rpc/src/methods.rs#L2217).
The method reads chain context from the state service (the tip hash, height,
expected difficulty, and the valid time range), fetches candidate transactions
from the mempool, selects them using the ZIP-317 fee-weighted algorithm,
constructs the coinbase transaction, computes the Merkle and authorizing-data
roots, and returns a template.

What the template leaves blank is the proof of work. The block header carries a
`nonce` field at
[`zebra-chain/src/block/header.rs:82`](https://github.com/ZcashFoundation/zebra/blob/76c440e67f2c909cbf8418b11a3f56371aed7d95/zebra-chain/src/block/header.rs#L82)
and an Equihash `solution` at
[`header.rs:85`](https://github.com/ZcashFoundation/zebra/blob/76c440e67f2c909cbf8418b11a3f56371aed7d95/zebra-chain/src/block/header.rs#L85).
The miner searches for a nonce and solution that make the block hash meet the
target. That search is the work; everything else in the header is fixed by the
template.

When a miner finds a solution, the pool returns the completed block through the
`submitblock` RPC at
[`methods.rs:2540`](https://github.com/ZcashFoundation/zebra/blob/76c440e67f2c909cbf8418b11a3f56371aed7d95/zebra-rpc/src/methods.rs#L2540).
It deserializes the hex into a `Block`
([`methods.rs:2547`](https://github.com/ZcashFoundation/zebra/blob/76c440e67f2c909cbf8418b11a3f56371aed7d95/zebra-rpc/src/methods.rs#L2547))
and hands it to the consensus block verifier as
`Request::Commit(Arc::new(block))`
([`methods.rs:2568`](https://github.com/ZcashFoundation/zebra/blob/76c440e67f2c909cbf8418b11a3f56371aed7d95/zebra-rpc/src/methods.rs#L2568)).
That request type is defined at
[`zebra-consensus/src/block/request.rs:9`](https://github.com/ZcashFoundation/zebra/blob/76c440e67f2c909cbf8418b11a3f56371aed7d95/zebra-consensus/src/block/request.rs#L9):
`Commit` runs full semantic validation (including the Equihash proof of work)
and then contextual validation, and commits the block. A sibling variant,
`CheckProposal`, skips the proof-of-work check and does not commit; it backs the
proposal mode of `getblocktemplate` at
[`get_block_template.rs:724`](https://github.com/ZcashFoundation/zebra/blob/76c440e67f2c909cbf8418b11a3f56371aed7d95/zebra-rpc/src/methods/types/get_block_template.rs#L724),
which lets a pool validate a template's structure before any work is done. If
the submitted block is accepted, the node advertises it to peers via
`advertise_mined_block`
([`methods.rs:2582`](https://github.com/ZcashFoundation/zebra/blob/76c440e67f2c909cbf8418b11a3f56371aed7d95/zebra-rpc/src/methods.rs#L2582)).

### receiving a block: gossip, download, verify, commit

A node usually learns of a block not from a miner but from a peer. The peer
sends an inventory message advertising hashes it has. The wire messages are
defined in
[`zebra-network/src/protocol/external/message.rs`](https://github.com/ZcashFoundation/zebra/blob/76c440e67f2c909cbf8418b11a3f56371aed7d95/zebra-network/src/protocol/external/message.rs#L146):
`Inv` (line 146) advertises inventory, `GetData` (line 196) requests it, and
`Block` (line 201) carries the block itself. When a connection decodes an `Inv`
containing a single block hash, it turns it into the internal
`Request::AdvertiseBlock` at
[`peer/connection.rs:1282`](https://github.com/ZcashFoundation/zebra/blob/76c440e67f2c909cbf8418b11a3f56371aed7d95/zebra-network/src/peer/connection.rs#L1282).

The inbound service routes that advertisement to the block downloader at
[`zebrad/src/components/inbound.rs:554`](https://github.com/ZcashFoundation/zebra/blob/76c440e67f2c909cbf8418b11a3f56371aed7d95/zebrad/src/components/inbound.rs#L554),
calling `download_and_verify`. The downloader fetches the block body with a
`BlocksByHash` request
([`inbound/downloads.rs:298`](https://github.com/ZcashFoundation/zebra/blob/76c440e67f2c909cbf8418b11a3f56371aed7d95/zebrad/src/components/inbound/downloads.rs#L298)),
enforces per-IP and concurrency limits to bound abuse, and then submits the
block to the consensus verifier with the same `Request::Commit(block)` that
`submitblock` uses
([`downloads.rs:395`](https://github.com/ZcashFoundation/zebra/blob/76c440e67f2c909cbf8418b11a3f56371aed7d95/zebrad/src/components/inbound/downloads.rs#L395)).
A locally mined block and a gossiped block converge on the same verification
entry point.

After semantic checks pass, the verifier commits the block to the state service
with `Request::CommitSemanticallyVerifiedBlock` at
[`zebra-consensus/src/block.rs:376`](https://github.com/ZcashFoundation/zebra/blob/76c440e67f2c909cbf8418b11a3f56371aed7d95/zebra-consensus/src/block.rs#L376),
and on success the state replies `Response::Committed`
([`block.rs:379`](https://github.com/ZcashFoundation/zebra/blob/76c440e67f2c909cbf8418b11a3f56371aed7d95/zebra-consensus/src/block.rs#L379)).
The state request type is defined at
[`zebra-state/src/request.rs:787`](https://github.com/ZcashFoundation/zebra/blob/76c440e67f2c909cbf8418b11a3f56371aed7d95/zebra-state/src/request.rs#L787).
Bulk historical sync uses a separate, lighter path,
`CommitCheckpointVerifiedBlock`, for blocks below the last checkpoint.

### re-gossiping to peers

Once a freshly committed block becomes the new best tip, the node advertises it
onward. The gossip task at
[`zebrad/src/components/sync/gossip.rs`](https://github.com/ZcashFoundation/zebra/blob/76c440e67f2c909cbf8418b11a3f56371aed7d95/zebrad/src/components/sync/gossip.rs#L131)
chooses how widely to announce: a locally submitted (mined) block goes to all
ready peers via `AdvertiseBlockToAll` (line 132), while a relayed block goes to
a fraction of peers via `AdvertiseBlock` (line 134). On the wire that becomes an
`Inv` message again, sent at
[`peer/connection.rs:1160`](https://github.com/ZcashFoundation/zebra/blob/76c440e67f2c909cbf8418b11a3f56371aed7d95/zebra-network/src/peer/connection.rs#L1160).
That closes the loop: a block enters as an `Inv` hash, is fetched, verified, and
committed, then leaves as an `Inv` hash to the node's own peers, which is how a
mined block propagates across the network one hop at a time.

## mining on testnet with Zebra

For testing the path end to end, the Zebra book documents a setup using
[s-nomp](https://github.com/ZcashFoundation/s-nomp/tree/49fd89bf32fac6fe2440143d16622650e061e5a0)
(ZcashFoundation `zebra-mining` fork) as the pool/stratum server and
[nheqminer](https://github.com/ZcashFoundation/nheqminer/tree/72e320aacaa49c9e170be62d28a4189957767d3c)
(also the `zebra-mining` fork) as the proof-of-work miner. This is explicitly a
testing configuration. The `s-nomp` fork predates network upgrades from NU5
onward, and the `tromp` CPU solver in `nheqminer` produces only a few solutions
per second. It is useful for exercising the RPC, not for competing for real
blocks. The Zcash Foundation has described mining testnet blocks against Zebra
using exactly this s-nomp fork in
[Experimental Mining Support in Zebra](https://zfnd.org/experimental-mining-support-in-zebra/).

The rough shape is:

- configure `zebrad.toml` with `network = "Testnet"`, a transparent
  `miner_address`, and an `rpc.listen_addr` (testnet RPC conventionally uses
  port 18232),
- sync `zebrad` to the testnet tip,
- run `s-nomp` pointed at Zebra's RPC port,
- point `nheqminer` at the `s-nomp` Stratum port.

One detail worth noting: when using `s-nomp`, you set
`rpc.enable_cookie_auth = false` in `zebrad.toml`, because that fork connects
without the cookie authentication Zebra enables by default. The full walkthrough
is in the Zebra book under the mining section.

### other pool and miner software

The `s-nomp` + `nheqminer` pair is the example Zebra's own documentation walks
through, not the only option. Zebra exposes a generic `getblocktemplate` and
`submitblock` interface, so in principle any pool-server software that speaks
those RPCs can drive it. Other pool/stratum servers in the Zcash and
Equihash-coin ecosystem include:

- [z-nomp](https://github.com/z-classic/z-nomp/tree/104dcf33f649090c2dd6acda6b4aa37ea68c8f55),
  a NOMP fork aimed at Zcash and Zclassic,
- [NOMP](https://github.com/zone117x/node-open-mining-portal/tree/b1b4daaa76d1ca98b29be056c710222518e7ac72)
  (Node Open Mining Portal), the ancestor of the `*-nomp` family,
- [YIIMP](https://github.com/tpruvot/yiimp/tree/52f68f8641632a783ba24f0d6591205db3a3bd81),
  a PHP-based multi-algorithm pool,
- [Miningcore](https://github.com/oliverw/miningcore/tree/a553f62301f44c6df80891e408b6526d1dd98692),
  a C#/.NET multi-coin engine with Equihash support.

There is an important caveat: availability is not the same as a working
integration. Only the `zebra-mining` fork of `s-nomp` is documented as tested
against Zebra, and `s-nomp`, `z-nomp`, NOMP, and Miningcore are each archived or
unmaintained upstream (the linked commits are their last states, not active
development). Any of these would need verifying against current Zebra and
current Equihash (200, 9) before relying on it. Large commercial pools run
proprietary stacks that are not public.

## mining inside Zebra: the internal miner

There is a detail I glossed over when I said a node "is not a miner": Zebra
ships an experimental internal miner, so for solo, regtest, or private-chain use
you can skip the external pool and miner entirely. The key is that the Equihash
algorithm has two sides, and Zebra has access to both through the `equihash`
crate published from [librustzcash](https://github.com/zcash/librustzcash):

- the verifier, `equihash::is_valid_solution`, which every node uses to check a
  block's proof of work
  ([`zebra-chain/src/work/equihash.rs:89`](https://github.com/ZcashFoundation/zebra/blob/76c440e67f2c909cbf8418b11a3f56371aed7d95/zebra-chain/src/work/equihash.rs#L89)),
- the solver, `equihash::tromp::solve_200_9`, a binding to Tromp's optimized
  Equihash (200, 9) solver, which searches for a valid solution
  ([`equihash.rs:155`](https://github.com/ZcashFoundation/zebra/blob/76c440e67f2c909cbf8418b11a3f56371aed7d95/zebra-chain/src/work/equihash.rs#L155)).

The solver is gated behind a Cargo feature so it is not compiled into the
default node:
[`zebra-chain/Cargo.toml:34`](https://github.com/ZcashFoundation/zebra/blob/76c440e67f2c909cbf8418b11a3f56371aed7d95/zebra-chain/Cargo.toml#L34)
reads `internal-miner = ["equihash/solver"]`, and `zebrad` re-exports the same
feature at
[`zebrad/Cargo.toml:66`](https://github.com/ZcashFoundation/zebra/blob/76c440e67f2c909cbf8418b11a3f56371aed7d95/zebrad/Cargo.toml#L66).
With that feature, `Solution::solve`
([`equihash.rs:134`](https://github.com/ZcashFoundation/zebra/blob/76c440e67f2c909cbf8418b11a3f56371aed7d95/zebra-chain/src/work/equihash.rs#L134))
drives the solver over a nonce range.

The component that ties it together is
[`zebrad/src/components/miner.rs`](https://github.com/ZcashFoundation/zebra/blob/76c440e67f2c909cbf8418b11a3f56371aed7d95/zebrad/src/components/miner.rs).
It runs, in-process, the exact loop from the earlier code section: it calls
`get_block_template`
([`miner.rs:282`](https://github.com/ZcashFoundation/zebra/blob/76c440e67f2c909cbf8418b11a3f56371aed7d95/zebrad/src/components/miner.rs#L282)),
runs `Solution::solve` on a blocking thread
([`miner.rs:578`](https://github.com/ZcashFoundation/zebra/blob/76c440e67f2c909cbf8418b11a3f56371aed7d95/zebrad/src/components/miner.rs#L578)),
and submits the solved block through `submit_block`
([`miner.rs:500`](https://github.com/ZcashFoundation/zebra/blob/76c440e67f2c909cbf8418b11a3f56371aed7d95/zebrad/src/components/miner.rs#L500)).
That is `getblocktemplate -> solve -> submitblock` with no `s-nomp` and no
`nheqminer`.

### activating the internal miner

Turning it on takes two steps, because the build-time feature and the runtime
switch are separate.

First, compile `zebrad` with the feature (the default release build omits it):

```console
cargo build --release --features internal-miner --bin zebrad
```

Second, enable it in the config and set an address to pay the coinbase to. The
relevant field is `internal_miner` in the `[mining]` section, defined at
[`zebra-rpc/src/config/mining.rs:43`](https://github.com/ZcashFoundation/zebra/blob/76c440e67f2c909cbf8418b11a3f56371aed7d95/zebra-rpc/src/config/mining.rs#L43):

```toml
[mining]
miner_address = "your-transparent-or-shielded-address"
internal_miner = true
```

At startup, `zebrad` only spawns the miner task when
`config.mining.is_internal_miner_enabled()` returns true
([`zebrad/src/commands/start.rs:440`](https://github.com/ZcashFoundation/zebra/blob/76c440e67f2c909cbf8418b11a3f56371aed7d95/zebrad/src/commands/start.rs#L440)),
which is what the `internal_miner = true` flag controls
([`mining.rs:49`](https://github.com/ZcashFoundation/zebra/blob/76c440e67f2c909cbf8418b11a3f56371aed7d95/zebra-rpc/src/config/mining.rs#L49)).
Run the resulting binary as usual (`zebrad start -c zebrad.toml`) and the miner
runs in-process.

### caveats, and a discrepancy worth knowing

Why does the rest of this post still point at external miners? A few reasons,
all visible in the code. The feature is labelled experimental
([`zebrad/Cargo.toml:65`](https://github.com/ZcashFoundation/zebra/blob/76c440e67f2c909cbf8418b11a3f56371aed7d95/zebrad/Cargo.toml#L65)),
and the solver is CPU-only and single-threaded per thread: the doc comment on
`solve` notes it "uses 144 MB of RAM and one CPU core" and "can run for minutes
or hours if the network difficulty is high"
([`equihash.rs:130`](https://github.com/ZcashFoundation/zebra/blob/76c440e67f2c909cbf8418b11a3f56371aed7d95/zebra-chain/src/work/equihash.rs#L130)).
The solver it binds, Tromp's, is the same family as `nheqminer`'s `tromp` CPU
solver, so the performance ceiling is similar, and it is not competitive with
GPU and ASIC solvers on mainnet.

There is also a discrepancy in Zebra's own source that is worth flagging rather
than papering over. The implementation in `miner.rs` runs the real Tromp solver
and checks difficulty before submitting, with no network restriction. But the
doc comment on the config field itself
([`mining.rs:38`](https://github.com/ZcashFoundation/zebra/blob/76c440e67f2c909cbf8418b11a3f56371aed7d95/zebra-rpc/src/config/mining.rs#L38))
describes the feature as "only supported on regtest" using "null solutions," and
`is_internal_miner_enabled` carries a stale TODO referring to a period when the
miner was disabled entirely (Zebra issues
[#8180](https://github.com/ZcashFoundation/zebra/issues/8180) and
[#8183](https://github.com/ZcashFoundation/zebra/issues/8183)). The safe reading
is to treat the internal miner as intended for Regtest and private chains, where
it is genuinely useful for producing blocks on demand, and to verify its
behaviour on any other network before depending on it.

In other words, the choice is not "node or miner" but which solver and how much
hardware: librustzcash's `equihash` solver is enough to mine, and Zebra already
wires it up, but production mining uses faster solvers and a pool layer to
aggregate many of them.

## what production miners run

Real Zcash mining uses different tools than the testnet setup. Zcash uses the
Equihash proof of work with parameters (200, 9), which is memory-hard: for GPUs,
VRAM bandwidth tends to matter more than raw compute, and reports suggest
NVIDIA/CUDA cards are better optimized for it than AMD.

### hardware and miner software

ASICs dominate the economics of Equihash (200, 9). In 2026 the machines most
discussed are Bitmain's Antminer Z15 family. Vendor and comparison sites quote
the following (verify against current listings before buying anything):

| model            | hashrate    | power   | efficiency   |
| ---------------- | ----------- | ------- | ------------ |
| Antminer Z15 Pro | ~840 kSol/s | ~2780 W | ~3.31 J/kSol |
| Antminer Z15     | ~420 kSol/s | ~1510 W | ~3.6 J/kSol  |

ASICs run vendor firmware and connect straight to a pool over Stratum, so there
is no separate miner program to install on them.

GPU mining is much less competitive against ASICs, but where it is done, the
common GPU miners are closed-source and distributed as binaries, each taking a
small developer fee skimmed from mining time:

- [lolMiner](https://github.com/Lolliedieb/lolMiner-releases/tree/5190a19b69de9f04e71e7038e8cc4f0b2afd459b)
  (around 0.7% dev fee), distributed through a binary-only releases repository,
- [GMiner](https://github.com/develsoftware/GMinerRelease/tree/5f76b1d87fb29d1578e31d53f2db51591b8e96c8)
  (around 2% dev fee). Its release repository lists Equihash variants `144_5`,
  `125_4`, and `210_9`, which are the parameter sets for coins like Bitcoin Gold
  and Beam, not Zcash's own `200_9`; treat GMiner as an Equihash-family miner
  and check the current build's coin list before assuming it mines ZEC,
- miniZ (around 2%, CUDA-focused). It is closed-source with no public code
  repository, and its former site `miniz.ch` no longer resolves to the project
  at the time of writing, so I am not linking it.

Two older miners, EWBF's CUDA Zcash miner and Bminer, are largely unmaintained
and have no canonical public source to link.

The one genuinely open-source miner in this list is `nheqminer`. Its source is
the NiceHash repository at
[nicehash/nheqminer](https://github.com/nicehash/nheqminer/tree/b9900ff8e3c6f8e5a46af18db454f2a2082d9f46)
(archived in 2021), and the Zebra-compatible variant is the
[ZcashFoundation/nheqminer `zebra-mining` fork](https://github.com/ZcashFoundation/nheqminer/tree/72e320aacaa49c9e170be62d28a4189957767d3c).
Because the GPU miners above are closed-source, the linked repositories hold
release binaries and documentation rather than buildable source.

### pools

Miners point their Stratum connection at a pool, not at a node directly. Pool
listings in 2026 include [2Miners](https://2miners.com/zec-mining-pool), F2Pool,
ViaBTC, AntPool, and Kryptex, with fees typically in the 0 to 1.5% range. As an
example of the endpoint format, 2Miners publishes
`stratum+tcp://zec.2miners.com:1010` with regional variants. Pool availability
changes over time, so it is worth confirming an endpoint is live and the pool
still supports ZEC before committing hardware.

## the wider mining industry, briefly

A few data points give context, with the caveat that the sources diverge and
many are commercially motivated:

- Market-size estimates vary widely. One projection puts the crypto-mining
  market near $31.76B in 2026, growing to about $62.29B by 2035 (a CAGR around
  7.8%); other reports cite figures several times smaller. The spread suggests
  these are loose estimates.
- Bitcoin's hashrate set highs in January 2026, briefly crossing 1 ZH/s (1,000
  EH/s), with forecasts pointing toward roughly 1.8 ZH/s by year end.
- Reporting describes a profit squeeze in early 2026, with mid-generation
  hardware running below breakeven unless operators have access to power below
  about 5 cents per kWh, which is driving consolidation.
- A recurring theme is mining firms repurposing data-center capacity and cheap
  power toward AI and high-performance computing workloads.

In my view, the directional trends here are more trustworthy than any single
dollar figure or ROI claim, because the precise numbers come from sources with
an interest in selling either hardware or a market-research report.

## summary

Zcash mining is not one program but a chain of them. The node validates and
serves block templates through `getblocktemplate`. The pool turns those
templates into a stream of small, measurable work units and distributes them
over Stratum. The miner, whether an ASIC running vendor firmware or a GPU
running a miner such as lolMiner, does the Equihash search and submits shares.
In Zebra's code, both a locally submitted block and a gossiped one meet at the
same `Request::Commit` verification path, and a committed best-tip block is
re-announced to peers as an `Inv` hash. Knowing where each piece sits makes it
clearer why "start a miner" is really several decisions: which node, which pool,
and which hardware.

## sources

- [Zebra repository](https://github.com/ZcashFoundation/zebra), with code links
  in this post pinned to the v4.5.1 commit
  [`76c440e6`](https://github.com/ZcashFoundation/zebra/tree/76c440e67f2c909cbf8418b11a3f56371aed7d95)
- [Experimental Mining Support in Zebra (Zcash Foundation)](https://zfnd.org/experimental-mining-support-in-zebra/)
- [ZIP 301: Zcash Stratum Protocol](https://zips.z.cash/zip-0301)
- [Bitcoin Wiki: Stratum mining protocol (V1)](https://en.bitcoin.it/wiki/Stratum_mining_protocol)
- [Stratum V2 protocol site](https://stratumprotocol.org/) and
  [sv2-spec repository](https://github.com/stratum-mining/sv2-spec)
- [Zebra issue #5234: RPC calls used by mining pools](https://github.com/ZcashFoundation/zebra/issues/5234)
- [2Miners ZEC mining pool](https://2miners.com/zec-mining-pool)
- [MiningPoolStats: Zcash](https://miningpoolstats.net/coins/zcash/)
- [Coin Bureau: best Zcash pools 2026](https://coinbureau.com/mining/best-zcash-pools)
- [CoinCodex: how to mine Zcash 2026](https://coincodex.com/article/75616/how-to-mine-zcash/)
- [lolMiner releases](https://github.com/Lolliedieb/lolMiner-releases/releases)
- [ASIC Miner Value: Antminer Z15](https://www.asicminervalue.com/miners/bitmain/antminer-z15)
- [CoinShares Bitcoin Mining Report Q1 2026](https://coinshares.com/insights/research-data/bitcoin-mining-report-q1-2026/)
- [The Block: 2026 Bitcoin mining outlook](https://www.theblock.co/post/383997/2026-bitcoin-mining-outlook)
- [Precedence Research: cryptocurrency mining market](https://www.precedenceresearch.com/cryptocurrency-mining-market)
