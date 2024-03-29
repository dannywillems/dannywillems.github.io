---
layout: post
title: Compile ruby with a different version of openssl
date: 2022-08-30 17:26:38 +0200
author: Danny Willems
tags: [ruby, rvm, openssl, RSS]
---

You may need to compile and install a ruby version using rvm with a different version of openssl.
On Ubuntu 22.04, openssl 3.0 is now used, and you will face build issues if you try to install ruby with rvm. Here a temporary fix.

1. Install rvm
2. `rvm pkg install openssl` to install `openssl-1.0.1i`
3. `rvm install ruby --with-openssl-dir=$HOME/.rvm/usr` to build with the
   previously installed version of openssl.
