---
layout: post
title:  play-with-coda-sandbox-3.2a
date:   2020-04-25 18:53:22 +0200
tags:   [BaDaaS, Coda Protocol, crypto currency, DLT, blockchain, SNARK, ZK, Zero knowledge proof, coda client, coda sandbox, coda testnet]
---

On 21/04/2020, [Coda](https://codaprotocol.com/) announced a new sandbox was live and a node is publicly available.
As I am following the project since some months, passively, I decided to start being active in the project and try it out.
The [documentation](https://codaprotocol.com/docs) is quite enough to start with some basic commands.

The team released a docker image that can be run quite simply with the command:
```bash
docker run \ 
  -v wallet-coda-32a.1:/root/keys --publish 3085:3085 \
  -d \
  --name coda \
  codaprotocol/coda-demo:sandbox-32a.1
```

I added the volume to keep the wallets out of the containers, and to avoid to re-import every time I kill the docker container.
Let's import some previous generated wallets
```
docker cp generated_key coda:/root/keys/
docker exec -it coda coda accounts import -privkey-path /root/keys/generated_key
```

The docker container comes with a pre-regenerated wallet containing 66000 tokens.
