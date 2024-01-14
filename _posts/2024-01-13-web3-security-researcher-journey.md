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

The course starts with an audit of an on-chain password store, with [this
repo](https://github.com/Cyfrin/3-passwordstore-audit/tree/audit-data).

### Scoping

Important: a team requesting a security review might only send you an Etherscan link.
There is a "verified" checkbox on Etherscan. But it doesn't mean that the code is secured.
When we do a review, we want to know the health of the code. It means we want to
know the degree of engineering they have given in the development process.
It includes CI, CD, engineering roles, test coverage, test suite, versions of
the library used and many other aspects that should not be avoided when doing
proper engineering.

As a reminder, as a security reviewer, your role is also to guide the team to
get good practices, and it is also your role to train them and inform them.
A security review is not only reviewing the code.
The second video, [Scoping:
Etherscan](https://updraft.cyfrin.io/courses/security/first-audit/etherscan?lesson_format=video)
is worth watching!

Worth reading is [the rekt
test](https://blog.trailofbits.com/2023/08/14/can-you-pass-the-rekt-test/).
Spent time reading and digesting it.

In particular, [this
article](https://www.theblock.co/post/156038/how-a-fake-job-offer-took-down-the-worlds-most-popular-crypto-game)
about Axie Infinity is an interesting showcase of how smart threat actors can
be.

Regarding testing, [Echidna, a fast smart contract
fuzzer](https://github.com/crytic/echidna) is a good tool to be added to the
stack. Even though `forge` already provides some fuzzing in the testing
framework, the fuzzing tactics can be different from one tool to another and
using more than one tools can help to find new cases. Echidna will be a tool to
add to my test suites.

The onboarding/scoping process is important, a summary of good questions to ask
is available
[here](https://github.com/Cyfrin/security-and-auditing-full-course-s23/blob/main/minimal-onboarding-questions.md)
with some extensions
[here](https://github.com/Cyfrin/security-and-auditing-full-course-s23/blob/main/extensive-onboarding-questions.md).
Going through it is worth reading.
