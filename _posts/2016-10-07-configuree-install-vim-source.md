---
ID: 506
title: >
  How to configure and install vim from source?
author: Danny Willems
post_date: 2016-10-07 20:54:49
post_excerpt: ""
layout: post
tags: [vim, RSS]
---

<a href="https://github.com/vim/vim/blob/master/runtime/doc/version8.txt">Vim
8.0</a> has been released some weeks ago and maybe you want to install it.
Sometimes, binaries in packages are often not up-to-date or configure with
python. Here the command to install it from source with python et python3
options (useful if you use
<a href="https://github.com/Valloric/YouCompleteMe">YouCompleteMe</a>):

```bash
git clone https://github.com/vim/vim
cd vim
./configure --enable-pythoninterp --enable-python3interp
make
sudo make install
```

You can also add other options. You can list them with:

```bash
./configure --help
```
