---
layout: post
title: Rethinking how we register domain names with zero-knowledge proofs, fully anonymously and verifiable
date: 2025-04-26 00:00:00
author: Danny Willems
tags: [dns, domain names, verifiable, decentralised]
---

Domain names are the backbone of Internet browsing. They are used everywhere —
from visiting your favorite websites to sending an email. Without domain names,
the Internet as we know it would be a maze of numerical IP addresses, difficult
to navigate and nearly impossible to remember.

## A Brief History of DNS

The Domain Name System (DNS) was invented in 1983 by Paul Mockapetris to solve a
growing problem: as the Internet expanded, it became impractical to maintain a
central list of IP addresses and their corresponding names. Originally, a single
file called `hosts.txt` was distributed manually among users. This file
contained mappings between names and IPs. As networks grew, this method became
unsustainable.

DNS introduced a decentralized*, hierarchical system that allowed users to access
websites using easy-to-remember names, while behind the scenes, DNS servers
translated those names into IP addresses. This scalable system laid the
groundwork for the explosive growth of the Internet in the decades that
followed.

*Well. Decentralised... Not really. But first, let's check some numbers.

## How Many Domain Names Are Registered Each Year?

As of the end of the first quarter of 2025, there were approximately **368.4
million domain name registrations** across all top-level domains (TLDs), marking
an increase of 4.2 million registrations, or 1.1%, compared to the previous
quarter [[1]](#sources).

In the fourth quarter of 2024, the total number of domain name registrations
stood at **364.3 million**, reflecting a year-over-year growth of 4.4 million
domains, or 1.2% [[2]](#source).

These figures show that domain name registration continues to grow steadily each
year, driven by the expanding need for online presence, the creation of new
businesses, and the availability of new TLDs.

Today, domain name registration is a massive industry. Each year, tens of
millions of domain names are registered across various registrars. According to
recent reports, over **350 million** domain names are currently registered
worldwide [[1]](#sources), and each year sees **around 30 to 40 million new
registrations**. This volume shows not only the importance of an online presence
but also the growing competition for recognizable names.

## The Structure of the DNS Infrastructure

The Domain Name System (DNS) is a hierarchical and decentralized naming system
that translates human-friendly domain names into IP addresses. The
infrastructure is composed of several key components:

1. **Root Servers**: At the top of the DNS hierarchy are the root servers, which
   are critical for resolving domain names. There are 13 logical root servers,
   labeled A through M, operated by 12 independent organizations [[3]](#sources). These
   operators include:

   - **VeriSign, Inc.** – Operates the A and J root servers.
   - **University of Southern California (ISI)** – Operates the B root server.
   - **Cogent Communications** – Operates the C root server.
   - **University of Maryland** – Operates the D root server.
   - **NASA Ames Research Center** – Operates the E root server.
   - **Internet Systems Consortium (ISC)** – Operates the F root server.
   - **U.S. Department of Defense (NIC)** – Operates the G root server.
   - **U.S. Army Research Lab** – Operates the H root server.
   - **Netnod** (Sweden) – Operates the I root server.
   - **RIPE NCC** (Netherlands) – Operates the K root server.
   - **ICANN** – Operates the L root server.
   - **WIDE Project** (Japan) – Operates the M root server.

   These organizations collaborate to ensure the stability and security of the
   DNS root zone [[4]](#sources).

2. **Top-Level Domain (TLD) Servers**: Below the root servers are the TLD
   servers, which manage domains like `.com`, `.org`, `.net`, and country-code
   TLDs like `.uk` or `.jp`. Each TLD is managed by a registry operator
   accredited by ICANN. For example:

   - **VeriSign, Inc.** – Manages the `.com` and `.net` TLDs.
   - **Public Interest Registry (PIR)** – Manages the `.org` TLD.
   - **Nominet UK** – Manages the `.uk` TLD.

3. **Authoritative Name Servers**: These servers hold the DNS records for
   specific domain names. When a user queries a domain, the authoritative name
   server provides the corresponding IP address. Domain owners typically
   configure these through their DNS hosting provider.

4. **Recursive Resolvers**: These are DNS servers, often operated by Internet
   Service Providers (ISPs) or third-party services like Google Public DNS or
   Cloudflare, that receive DNS queries from end-users and recursively query the
   DNS hierarchy to resolve domain names.

This multi-layered setup ensures that even if some servers fail, DNS can still
function globally.

## Understanding Top-Level Domains and Authoritative Domains

A **Top-Level Domain (TLD)** is the last segment of a domain name — like `.com`,
`.net`, `.org`, or newer ones like `.xyz` and `.tech`. They categorize domains
broadly and are managed by designated organizations (like Verisign for `.com`).

Below the TLD are the **authoritative domains**, which are responsible for
specific domain names. For instance, in `example.com`, the domain `example` is
managed by the owner who registered it, and they can set up subdomains like
`blog.example.com` or `shop.example.com`.

When a domain is registered, its details are entered into a registry maintained
by the TLD authority, and the registrar provides the link between the user's
chosen name and the wider DNS system.

## Why DNS is Not Truly Decentralized

While the DNS system is globally distributed across many servers and operators,
it is ultimately **governed and coordinated by a handful of central
organizations** like ICANN and the root server operators. Critical actions —
like creating a new TLD, transferring domain ownership, or updating root zone
files — require permission and control from centralized bodies.

Additionally, registering a domain name today requires:
- Providing personal identity information (often stored in registrars' databases),
- Trusting registries to maintain records accurately and without censorship,
- Relying on third parties for DNS hosting and security.

This introduces central points of failure, censorship risk, and privacy
concerns.

## Blockchain and ENS: A Step, but Not the Full Solution

The **Ethereum Name Service (ENS)**, launched on **May 4, 2017**, is a
decentralized naming system built on the Ethereum blockchain. It allows users to
register human-readable `.eth` domain names, which can be linked to Ethereum
addresses, smart contracts, and other resources, simplifying interactions within
the Ethereum ecosystem.

TODO: add sources for these numbers

As of **December 2023**, ENS has seen substantial growth:

- **Over 2.16 million** `.eth` domain names registered.
- **Approximately 793,600** unique participants have engaged with the ENS system

Despite its decentralized nature, ENS presents certain challenges:

- **Public Transactions**: Registering or updating a `.eth` domain requires an
  on-chain Ethereum transaction, which is publicly visible and permanently
  recorded.
- **Pseudonymity Leakage**: Linking a domain to an Ethereum address can
  inadvertently expose user identities, especially when combined with other
  on-chain activities.
- **Transparency**: All domain registrations and updates are accessible on the
  Ethereum blockchain, allowing anyone to audit and analyze domain activities.

These aspects, while promoting transparency, can compromise user privacy. For
instance, the ENS Registry smart contract is publicly accessible, and domain
ownership details can be viewed on platforms like Etherscan:

- ENS Registry Contract:
  [0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e](https://etherscan.io/address/0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e)
- ENS Domain Lookup: [Etherscan ENS Search](https://etherscan.io/ens)

Ethereum Name Service (ENS) brought domains onto the blockchain, removing
reliance on centralized registries. However, registering a `.eth` domain **still
requires creating a public Ethereum transaction**, linking your domain to an
**Ethereum address** [[7]](#sources) [[8]](#sources).

This leads to two key problems:
- **Pseudonymity leakage**: Your wallet address (and potentially your identity)
  can be linked to a domain name forever. Anyone can inspect the ENS smart
  contracts [[9]](#sources) and explore all domain ownership mappings.
- **High transparency**: All ENS domain registrations are recorded publicly on
  Ethereum, making it trivial to audit, analyze, or trace domain activity
  [[10]](#sources).

While decentralized, ENS sacrifices **privacy**.

## Browser Integration of Decentralized Domains: The Case of ENS and Brave

Decentralized domain systems are not just theoretical concepts. Projects like
**Ethereum Name Service (ENS)** have already demonstrated that blockchain-based
domains can be integrated into everyday Internet browsing.

Since 2021, the **Brave browser** natively resolves `.eth` domains without
requiring any plugins or extensions [[5]](#sources). Users can simply type a
domain like `vitalik.eth` directly into the address bar, and Brave will:

1. Detect that `.eth` is not a traditional TLD.
2. Query the Ethereum blockchain using an RPC endpoint (like Infura).
3. Resolve the domain to an IPFS hash, Ethereum address, or a linked website.
4. Render the result for the user.

This system shows that **mainstream browser integration** of blockchain-based
domains is not only feasible but already happening.

Other projects have followed a similar approach:
- **Opera** added support for `.eth`, `.crypto`, and other blockchain
  domains [[6]](#sources).
- Chrome and Firefox users can resolve `.eth` domains using extensions like
  **MetaMask** or by appending `.link` (e.g., `vitalik.eth.link`).

## Implications for a zkSNARK-Based Domain System

Following a similar path, a zero-knowledge domain system could integrate
with browsers by:

- Providing a simple, lightweight **resolver library** (in JavaScript, Rust, or
  C++) for zk-proofs.
- Using a small (or constant-sized blockchain) to validate domain proofs
  without heavy infrastructure.
- Setting standards for domain discovery (e.g., `.zkd` TLD)
- Collaborating with privacy-focused browsers like **Brave** to offer native
  zk-domain resolution.

Given the successful example of ENS, it is clear that **browser-level
integration** for decentralized and even **privacy-preserving domain names** is
a realistic, achievable goal.

## Towards Private Decentralized Domain Registration with Mina and zk-SNARKs

Mina Protocol, with its lightweight blockchain and built-in zero-knowledge proof
system, offers a unique opportunity: **registering and proving ownership of a
domain name without revealing your identity or address publicly.**

A zk-SNARK-based domain system on Mina could:
- Allow a user to **prove** they have the right to register a domain (e.g., by
  paying a fee) **without exposing their address**.
- **Separate the proof** of ownership from the actual account.
- Enable **anonymous or pseudonymous** domain ownership.
- Make domain ownership **portable** and **privacy-preserving**.

In short, you could imagine **"zero-knowledge domain registrations"**:
- You submit a zk-proof to a smart contract that says "I paid" or "I am entitled
  to register this domain" — without revealing your wallet.
- Validators verify the proof without ever learning your identity.
- The domain itself is recorded and resolved using a decentralized system
  (off-chain or using lightweight ledger proofs).

## Why is Mina the Best Fit?

- **Ultra-lightweight blockchain**: Mina's whole blockchain is a constant ~22
  KB, easy to embed in browsers and IoT devices.
- **Native zk-SNARKs**: Mina is built from the ground up to verify proofs
  efficiently.
- **Programmable zero-knowledge applications (zkApps)**: Developers can easily
  create smart contracts that require proofs without exposing on-chain data.
- **Focus on privacy**: Unlike most blockchains that treat transparency as
  default, Mina treats **privacy as a first-class citizen**.

## Conclusion

Decentralizing domain name registration is not enough — true **private
decentralized domain ownership** is the next step.
By leveraging zero-knowledge proofs and a lightweight decentralized network like
Mina, it becomes possible to create a new domain system: one that ensures
**freedom**, **privacy**, and **censorship resistance** for everyone.

## Sources

- [1] [The DNIB Quarterly Report Q1 2025](https://www.dnib.com/articles/the-domain-name-industry-brief-q1-2025)
- [2] [DNIB.com Reports Internet Has 364.3 Million Domain Name Registrations at End of Q4 2024](https://www.businesswire.com/news/home/20250206463726/en/DNIB.com-Reports-Internet-Has-364.3-Million-Domain-Name-Registrations-at-the-End-of-the-Fourth-Quarter-of-2024)
- [3] [Root Server Technical Operations Association](https://root-servers.org/)
- [4] [ICANN - The Root Server System](https://www.icann.org/root-server-system-en)
- [5] [GitHub - Brave browser - Add ENS support](https://github.com/brave/brave-browser/issues/14477)
- [6] [Opera adds Unstoppable Domains support to desktop and iOS browsers, providing you with seamless access to the decentralized web](https://blogs.opera.com/desktop/2021/04/opera-web3-support-unstoppable-domains-nft/)
- [7] [ENS Official Documentation - How ENS Works](https://docs.ens.domains/ens-intro)
- [8] [Registering a Name - ENS Docs](https://docs.ens.domains/dapp-developer-guide/registration)
- [9] [ENS Registry Smart Contract on Etherscan](https://etherscan.io/address/0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e)
- [10] [Viewing ENS Domains and Owners on Etherscan](https://etherscan.io/ens)

