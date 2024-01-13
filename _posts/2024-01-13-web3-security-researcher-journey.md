---
layout: post
title: My Web3 security researcher journey
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

## January 2024

First, I started running an Ethereum full node for mainnet. I use geth and lighthouse.

It all starts with learning Solidity.
I have deployed some basic smart contracts in Solidity, an ERC20 and an incremental counter contracts.
The incremental counter is pretty simple:
```
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