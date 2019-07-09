---
ID: 525
post_title: >
  Compile from source and install it in
  your home.
author: Danny Willems
post_date: 2017-05-17 05:29:38
post_excerpt: ""
layout: post
permalink: >
  https://blog.danny-willems.be/en/compile-from-source-install-home/
published: true
---
Since several months, I would always like to build software from source. It began when I would install vim 8.0 but no packages for Ubuntu were available. I wrote <a href="https://blog.danny-willems.be/en/configure-install-vim-source/">an article about it</a>.

I began by building from source and install it with sudo. But, I had some issues when the package was updated because there were some conflicts.
For these reasons, I decided to build from source and to install the binaries in a separated directory in my home, called <b>$HOME/.bin/</b>. When the binaries are installed in this directory, I only need to extend my PATH with the appropriate subdirectories.

Here some example.

<h3>Git</h3>
In Ubuntu, the version provided by packages is 2.7.4 from 2016. The current version if 2.13. All source codes I need are in a directory called <b>$HOME/.source</b>. I use the following commands to build git from source and install it locally.
[code lang="bash"]
mkdir -p $HOME/.source
git clone https://github.com/git/git $HOME/.source/git
cd $HOME/.source/git
./configure --prefix=$HOME/.bin/git
make -j 8
make install
[/code]

The usual commands to build C programs are ./configure &amp;&amp; make &amp;&amp; make install and you can pass some arguments like --prefix=path to ./configure to change the directory where the binaries must be installed.

<h3>Emacs</h3>

Even if I'm a vim user since several years, I switched to Emacs some months ago. I also want to have the latest version and I use the following commands.
[code lang="bash"]
mkdir -p $HOME/.source
git clone https://github.com/emacs-mirror/emacs $HOME/.source/emacs
cd $HOME/.source/emacs
./configure --prefix=$HOME/.bin/emacs
make -j 8
make install
[/code]

Usually you will easily find the commands to build. If configure is used, you can often use the flag --prefix (it is recommended by the GNU project to always add it when you provide a configure script). I personally recommend it to avoid conflicts and to easily remove the version you don't want to use anymore.

Hope it can help you.