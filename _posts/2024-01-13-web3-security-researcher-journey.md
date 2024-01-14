---
layout: post
title: My Web3 security researcher journey (WIP)
date: 2024-01-13 11:02:36 +0000
author: Danny Willems
tags: [smart contracts, ethereum, solidity]
---


This article will be updated over the years.

Web3 is on fire.
More projects popping up every day.
Time for security.

Besides my engineering and ("traditional") researcher work, I have always been fascinated by security research.
This article will over the years describe my web3 security researcher journey.
Digging into the security industry makes me a better engineer and traditional
researcher as I learn how to bypass some security flaws that might be present in
my code.

## January 2024

First, I started running an Ethereum full node for mainnet. I use geth and lighthouse.

I am following the Cyfrin course about security and auditing available [here](https://github.com/Cyfrin/security-and-auditing-full-course-s23).
I should have started with the Solidity one, available [here](https://www.youtube.com/watch?v=GWLxIYAIMqQ&list=PL2-Nvp2Kn0FPH2xU3IbKrrkae-VVXs1vk), but I will first finish the Security and auditing.
I have deployed some basic smart contracts in Solidity, an ERC20 and an incremental counter contracts.
The incremental counter is pretty simple:
```solidity
pragma solidity ^0.8.13;

contract Counter {
    uint256 public number;

    function setNumber(uint256 newNumber) public {
        number = newNumber;
    }

    function increment() public {
        number++;
    }
}
```

You have a storage containing a number, and one setter and one method to increment the storage. Nothing more.
The journey starts by playing with [Foundry](https://github.com/foundry-rs/foundry).
Learning `forge test`, `forge build`, `forge create`, `forge test --gas-report`.

[Section 2.1](https://updraft.cyfrin.io/courses/security/audit/what-is-an-audit)
contains an interesting overview on how a security audit/security review should
happen.

Have a look at [Simple Security toolkit](https://github.com/nascentxyz/simple-security-toolkit).

Static analyzer tool for Solidity and Vyper: https://github.com/crytic/slither

About Solidity development, it seems that Emacs does not integrate it well.
There is no standard lsp implementation at the moment in the Solidity community.
There is one from
[NomicFoundation](https://github.com/NomicFoundation/hardhat-vscode/), but
it is for VSCode.
However, the industry changed a lot since my first day in the Ethereum community
circa 2017. I have seen the first versions of Solidity, and played a bit that
time. Honestly, I forgot most of it as I did not practice.

I think I will need to spend some time going into VSCode and get used to it.
I also spent a bit of time going into Copilot to see if it could help, and the
answer is no at the moment. Nothing serious coming out of the AI coding
assistant.

On January 13th, I finished the first two sections, precisely the section
regarding the `Review` and `What is a smart contract audit`.
I signed up for rekt.news and some other blogs.
Going through the different GitHub repositories take time. I had also a look at
some reports.

Tomorrow I will spend time on the Section 3 and hopefully Section 4. The section
3 is `Your first Audit | PasswordStore`. The section 4 is `Puppe raffle`. See
you later!

## January 14th

Starting the day with a
[tweet](https://twitter.com/dwillems42/status/1746480016307703978) to thank
great content creators.

Back to Solidity, my journey will have to include a Solidity course as the language evolves since inception.
[This video](https://www.youtube.com/watch?v=umepbfKp5rI&t=1s) might be a good
starting point. I'll give a better opinion later.
Today is focusing on the plan sketched yesterday.

A good thing about Cyfrin is that it also contains good additional content on
the GitHub. Reading it while watching the videos is good.

