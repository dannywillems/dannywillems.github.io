---
title: Witness Encryption: A Definitive Overview
use_math: true
---

## Introduction

Witness encryption is a novel cryptographic primitive that enables encryption to an NP statement, where the ciphertext can only be decrypted by a holder of a witness. In this article, we provide a comprehensive overview of witness encryption, including its syntax, soundness, and extractable witness encryption. We also discuss the differences between witness encryption and other cryptographic primitives, such as identity-based encryption (IBE), attribute-based encryption (ABE), and functional encryption (FE).

The syntax of witness encryption is defined as follows: given a statement $x$ and a message $m$, the encryption algorithm $Enc(x, m)$ produces a ciphertext that can only be decrypted by a holder of a witness $w$ such that $(x, w) \in R$, where $R$ is a relation. The soundness property of witness encryption ensures that if $x \notin L$, where $L$ is the language defined by the relation $R$, then no holder of a witness can decrypt the ciphertext.

Extractable witness encryption is a stronger notion of witness encryption, where the encryption algorithm not only ensures soundness but also provides a way to extract the witness from the ciphertext. This property is essential in various applications, such as timed-release decryption and conditional escrow.

## The Landscape of Constructions

Several constructions of witness encryption have been proposed in the literature. We provide an overview of some of the notable constructions:

A. **GGH13-Multilinear Witness Encryption**: The GGH13 construction is based on the multilinear map scheme of Garg, Gentry, and Halevi. However, this construction has been cryptanalyzed, and its security has been compromised.

B. **Witness Encryption from Indistinguishability Obfuscation (iO)**: Sahai and Waters proposed a construction of witness encryption from iO, which is a powerful cryptographic primitive. This construction is based on the idea of encoding the witness in the ciphertext and using iO to obfuscate the encoding.

C. **Witness Encryption from Compact Functional Encryption**: Another construction of witness encryption is based on compact functional encryption, which is a variant of functional encryption that allows for compact ciphertexts.

D. **Position-Based Witness Encryption**: Position-based witness encryption is a variant of witness encryption that is based on the position of the witness in the relation $R$.

E. **Pre-Witness Encryption**: Pre-witness encryption is a weaker variant of witness encryption that can be constructed from standard assumptions, such as the decisional Diffie-Hellman assumption.

## Comparative Analysis

We provide a comparative analysis of the different constructions of witness encryption in the following table:

| Construction | Assumption | Soundness Type | NP-Language Class |
| --- | --- | --- | --- |
| GGH13 | Multilinear map | Computational | NP |
| Sahai-Waters | iO | Statistical | NP |
| Compact FE | Compact FE | Computational | NP |
| Position-Based | Position-based | Computational | NP |
| Pre-WE | Standard assumptions | Computational | NP |

## Security Analysis

The security of witness encryption is based on the soundness property, which ensures that if $x \notin L$, then no holder of a witness can decrypt the ciphertext. However, the extractability property of witness encryption is not always achievable, especially under contrived auxiliary input. We discuss the history of broken candidates and the current state of the art in witness encryption.

## Implementation Considerations

Witness encryption is still a largely theoretical concept, and its implementation is not yet practical. However, we discuss the current concrete cost of implementing witness encryption and the potential applications of this primitive.

## Future Directions

We discuss the future directions of witness encryption, including the construction of witness encryption from standard assumptions, time-lock witness encryption via verifiable delay functions (VDFs), and the relationship between witness encryption and conditional disclosure of secrets (CDS).

## Generic Applications

Witness encryption has several generic applications, including:

* Timed-release decryption
* Conditional escrow
* Bounty mechanisms
* Reactive disclosure of secrets

These applications are not tied to crypto-assets and can be used in various scenarios, such as secure data sharing and conditional access control.