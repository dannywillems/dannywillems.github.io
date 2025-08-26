---
layout: post
title: We have some designs and implementations of zkVMs. What's next now?
date: 2023-12-09 00:02:36 +0000
author: Danny Willems
tags: [zkvm, next, designs, gaming]
---

In the last few years, we have seen some zkVM implementations in the zk
industry. Here a few:

- [Polygon zkEVM](https://polygon.technology/polygon-zkevm)
- [PSE zkEVM](https://github.com/privacy-scaling-explorations/zkevm-specs)
- [Risc Zero](https://www.risczero.com/)
- [Winterfell](https://github.com/facebook/winterfell)
- [Distaff](https://github.com/GuildOfWeavers/distaff)
- [MidenVM](https://github.com/0xPolygonMiden/miden-vm)

The world of zkVM is still growing. Numerous designs pop up, and the efficiency
and SNARK techniques keep popping. In this article, I will give some ideas of
applications, with the related infrastructure that we would need to set up.

## Gaming industry

If you met me and asked me about zkVM usecase, I've certainly mentioned some
gaming related projects.

A zkVM is an emulator, which proves that between two games, the transition is
correctly saved. When you start your GB, your game is an initial state. When you
start to go to bed, i.e. you finished playing, it is in a final state. A zkVM
can prove the execution trace, i.e. your play, between these two states. Thanks
to the succintness, the game state can also be compressed in a very small number
of bytes.

Recently, I found my Gameboy Color Pikachu, and decided to play to Pokemon
Crystal. I remember how many hours I played at this. I captured (ok, with Action
Replay :)) all 251 Pokemon when I was like 10-11 years old. I booted up the
game, and... oh... empty game state. Yes. Hundreds of hours gone. You can
imagine how disappointed I was.

Imagine that the state could have been compressed somewhere. And available on
some chains that I could have retrieved...

I also played [Dofus](https://www.dofus.com/en/prehome) when I was 12-13 for a
year or two. I was on Raval. I had a Xelor, and excelled in more than 15
professions. I had some rare Dofus that I cannot remember. I paid some dozens of
euros. Spent hundreds of hours (instead of studying...). At uni, I saw that the
Dofus fewer was a thing. I decided to log in. And. Bam. Raval does not exist
anymore. All items, all skills, gone.

Imagine that I had a proof that I bought some NFTs, or that my Xelor had some
items. I could claim back to Ankama. Also, as it is a succint proof, the data
that I had to keep is very small, only a few bytes.

### Some project ideas

- Based on existing zkVM, implement another ISA which is used by some old game
  consoles.
- An emulator can be written, and a zkVM feature can be added to save on-chain
  the state of the game.

## Cybersecurity industry

### Existing projects

- [Zemse](https://github.com/zemse/proof-of-exploit)

### Some project ideas

- Using the MIPS zkVM from o1Labs, implement a proof of a buffer overflow. Post
  it on-chain.
