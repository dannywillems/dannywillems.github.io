---
ID: 546
title: Compile libxml2 on MacOS
author: Danny Willems
post_date: 2019-02-23 16:13:06
post_excerpt: ""
layout: post
published: true
tags: [MacOS, libxml2, RSS]
---

As I have been facing some issues building [libxml2](http://xmlsoft.org/) from
source recently on my Mac, here some instructions that may help some of you.

First, be sure you have install `make` from homebrew to get a more recent
version than 3.81, the one provided with the XCode tools. Be sure the newest
version of `make` is used in your shell (updating your `PATH` for example). This
step is not required, but it is always better to use `make >= 4.0` for
compatibility issues you may face in the future. Install also the `automake`
toolset.

```
brew install make
brew install automake
```

And here the commands to compile:

```shell
git clone https://gitlab.gnome.org/GNOME/libxml2
cd libxml2
autoreconf --install
./configure --prefix=$HOME/.lib/libxml2  # choose the prefix you want
make
make install
```
