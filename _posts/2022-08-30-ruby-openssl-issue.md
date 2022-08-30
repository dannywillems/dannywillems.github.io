---
title: Compile ruby with a different version of openssl
author: Danny Willems
post_date: 2022-08-30 17:26:38
post_excerpt: ""
layout: post
published: true
tags: [ruby, rvm, openssl]
---

You may need to compile and install a ruby version using rvm with a different version of openssl.
On Ubuntu 22.04, openssl 3.0 is now used, and you will face build issues if you try to install ruby with rvm. Here a temporary fix.

1. Install rvm
2. `rvm pkg install openssl` to install `openssl-1.0.1i`
3. `rvm install ruby --with-openssl-dir=$HOME/.rvm/usr` to build with the
   previously installed version of openssl.
