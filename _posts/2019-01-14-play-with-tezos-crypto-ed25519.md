---
ID: 545
title: Play with Tezos - Tezos_crypto module and Ed25519 elliptic curve
author: Danny Willems
post_date: 2019-01-14 16:13:06
post_excerpt: ""
layout: post
published: true
tags: [OCaml, Tezos, Cryptography, ED25519, Elliptic Curve, EC]
---

Let's play today with some submodules of [Tezos_crypto](https://gitlab.com/tezos/tezos/tree/master/src/lib_crypto).
First, compile Tezos and install `utop`
```shell
git clone https://gitlab.com/tezos/tezos/ /tmp/tezos-play
cd /tmp/tezos-play
make build-deps
eval $(opam config env)
make
make build-dev-deps
opam install utop
```

Now, move to the directory `src/lib_crypto` and run `dune utop`.

```shell
cd src/lib_crypto
dune utop
```

For the moment, Tezos does support 3 elliptic curves: Ed25519, P256 and
secp256k1. Today, we are going to focus on Ed25519, implemented using a binding
to HaCl (see [open
HaCl](https://gitlab.com/tezos/tezos/blob/master/src/lib_crypto/ed25519.ml#L48)
statement at the top of the file).

Tezos uses the base58 prefixes `edsk` for the Ed25519 private keys and `edpk` for
the public keys to encode the keys. You can check the prefixes
[here](https://gitlab.com/tezos/tezos/blob/master/src/lib_crypto/base58.ml#L347).
The relevant OCaml module in `lib_crypto` to play with Ed25519 is
[ed25519.ml](https://gitlab.com/tezos/tezos/blob/master/src/lib_crypto/ed25519.ml).

Let's take one Ed25519 private key, encoded in baes58 using the Tezos prefix:
`edsk31vznjHSSpGExDMHYASz45VZqXN4DPxvsa4hAyY8dHM28cZzp6`. That's the one
generated for you when you create a [Tezos sandbox
environment](https://tezos.gitlab.io/user/sandbox.html).

The top module does also provide a function to generate a keypair:
```ocaml
let pkh, pk, sk = Tezos_crypto.Ed25519.generate_key ();;
(* val pkh : Tezos_crypto.Ed25519.Public_key_hash.t = <abstr> *)
(* val pk : Tezos_crypto.Ed25519.Public_key.t = <abstr> *)
(* val sk : Tezos_crypto.Ed25519.Secret_key.t = <abstr> *)
```

The pubkeyhash (pkh) is the corresponding tz1 address. See below.

The module we are interested in is `Tezos_crypto__Ed25519`. It does provide the
submodules `Secret_key` and `Public_key` to respectively manage secret and
public keys. The top module and the type `Tezos_crypto.Ed25519.t` is used to
represent a signature:

```ocaml
let ed_sk = Tezos_crypto__Ed25519.Secret_key.of_b58check_exn
  "edsk31vznjHSSpGExDMHYASz45VZqXN4DPxvsa4hAyY8dHM28cZzp6";;
(* val ed_sk : Tezos_crypto.Ed25519.Secret_key.t = <abstr> *)
let ed_pk = Tezos_crypto__Ed25519.Secret_key.to_public_key ed_sk;;
(* val ed_pk : Tezos_crypto.Ed25519.Public_key.t = <abstr> *)
let base58_ed_pk = Tezos_crypto__Ed25519.Public_key.to_b58check ed_pk;;
(* val base58_ed_pk : string =
  "edpkuSLWfVU1Vq7Jg9FucPyKmma6otcMHac9zG4oU1KMHSTBpJuGQ2" *)
```

Notice the secret key and the public key have different types, respectively
`Tezos_crypto.Ed25519.Secret_key.t` and `Tezos_crypto.Ed25519.Public_key.t`.
Even if intrinsically, secret and public keys are bytes, the type system avoids
using a secret key in place of a public key and vice versa in the different
functions.

Let's now sign and verify a message with these keys using `Tezos_crypto.Ed25519.sign` and `Tezos_crypto.Ed25519.check`:
```ocaml
let signature = Tezos_crypto.Ed25519.sign ed_sk (Bytes.of_string "Hello, World!");;
(* val signature : Tezos_crypto.Ed25519.t = <abstr> *)
Tezos_crypto.Ed25519.check ed_pk signature (Bytes.of_string "Hello, World!");;
(* - : bool = true *)
```

The message can be any document, and these functions may be used to verify Alice signs the document. We also expect the `check` function to return `false` if Eve signs the message:

```ocaml
(* We generate a random secret key (which would be Eve's) to sign the message *)
let _, _, eve_ed_sk = Tezos_crypto.Ed25519.generate_key ();;
let signature = Tezos_crypto.Ed25519.sign eve_ed_sk (Bytes.of_string "Hello, World!");;
(* and Bob checks the signature using Alice public key, ed_pk in our case, which is invalid *)
Tezos_crypto.Ed25519.check ed_pk signature (Bytes.of_string "Hello, World!");;
(* - : bool = false *)

```
It is worth to mention, thanks to the type system, we cannot use a public key to sign a message:
```ocaml
let signature = Tezos_crypto.Ed25519.sign ed_pk (Bytes.of_string "Hello, World!");;
(* Error: This expression has type Tezos_crypto.Ed25519.Public_key.t
       but an expression was expected of type Tezos_crypto.Ed25519.Secret_key.t
*)
```
and we cannot use a secret key to verify a signature:
```ocaml
Tezos_crypto.Ed25519.check ed_sk signature;;
(* Error: This expression has type Tezos_crypto.Ed25519.Secret_key.t
       but an expression was expected of type Tezos_crypto.Ed25519.Public_key.t
*)
```

To get the Tezos address related to this keypair, we use the module
`Tezos_crypto.Ed25519.Public_key_hash`. Let's remind a Tezos address is simply a
hash of the public key, base58 encoded with a specific prefix.
The public key hash for a Ed25519 keypair starts with `tz1`. To get the hash of
the public key as bytes (as a `Bytes.t` type in Tezos codebase), we use the function `Tezos_crypto.Ed25519.Public_key.hash`:

```ocaml
let decoded_pkh = Tezos_crypto.Ed25519.Public_key.hash pk;;
(* val decoded_pkh : Tezos_crypto.Ed25519.Public_key_hash.t = <abstr> *)
```

Let's finish with the base58 encoded version of the public key hash:
```ocaml
let b58_encoded_pkh = Tezos_crypto.Ed25519.Public_key_hash.to_b58check decoded_pkh;;
(* val b58_encoded_pkh : string = "tz1cp2CRXtX3dDWTtqbTocCTmMdKv69AuWNb" *)
```
