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
are different programs with different jobs.

This article was written with the help of an AI assistant, working from my own
questions, the Zebra source code, and the web sources linked at the end. Treat
the profitability and market figures as the claims of their (often commercial)
sources, not as my recommendations. Numbers in this space change quickly.

<!--more-->

## a node is not a miner

Zebra is a Zcash validator node. It validates blocks and transactions, follows
the chain, and talks to peers. It does not, by itself, mine. There is no
`zebrad mine` subcommand.

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

Two properties matter. Stratum is push-based, so the pool notifies miners of new
work rather than miners polling for it. And the split between share difficulty
and network difficulty is what makes pooled mining low-variance and measurable.

Putting the pieces in order:

```
ASIC / GPU  --Stratum/TCP-->  pool stratum server  --getblocktemplate RPC-->  zebrad
```

There is also a newer redesign, Stratum V2, which is binary, encrypted, and adds
a mode that lets miners choose their own transaction set rather than accepting
the pool's. Its production use so far has been mostly in Bitcoin. I did not find
evidence of meaningful Stratum V2 adoption in Zcash mining, so for Zcash the
practical protocol today is still V1.

## mining on testnet with Zebra

For testing the path end to end, the Zebra book documents a setup using
[s-nomp](https://github.com/ZcashFoundation/s-nomp) as the pool/stratum server
and `nheqminer` as the proof-of-work miner. This is explicitly a testing
configuration. The ZcashFoundation `s-nomp` fork predates network upgrades from
NU5 onward, and the `tromp` CPU solver in `nheqminer` produces only a few
solutions per second. It is useful for exercising the RPC, not for competing for
real blocks.

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
common closed-source miners that support Equihash (200, 9) are
[lolMiner](https://github.com/Lolliedieb/lolMiner-releases) (around 0.7% dev
fee), GMiner (around 2%), and miniZ (around 2%, CUDA-focused). Each takes a
developer fee skimmed from mining time.

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
running lolMiner, GMiner, or miniZ, does the Equihash search and submits shares.
Knowing where each piece sits makes it clearer why "start a miner" is really
several decisions: which node, which pool, and which hardware.

## sources

- [Zebra repository](https://github.com/ZcashFoundation/zebra)
- [2Miners ZEC mining pool](https://2miners.com/zec-mining-pool)
- [MiningPoolStats: Zcash](https://miningpoolstats.net/coins/zcash/)
- [Coin Bureau: best Zcash pools 2026](https://coinbureau.com/mining/best-zcash-pools)
- [CoinCodex: how to mine Zcash 2026](https://coincodex.com/article/75616/how-to-mine-zcash/)
- [lolMiner releases](https://github.com/Lolliedieb/lolMiner-releases/releases)
- [ASIC Miner Value: Antminer Z15](https://www.asicminervalue.com/miners/bitmain/antminer-z15)
- [CoinShares Bitcoin Mining Report Q1 2026](https://coinshares.com/insights/research-data/bitcoin-mining-report-q1-2026/)
- [The Block: 2026 Bitcoin mining outlook](https://www.theblock.co/post/383997/2026-bitcoin-mining-outlook)
- [Precedence Research: cryptocurrency mining market](https://www.precedenceresearch.com/cryptocurrency-mining-market)
