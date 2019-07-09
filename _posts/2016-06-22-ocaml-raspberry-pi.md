---
title: OCaml on Raspberry Pi
author: Danny Willems
post_date: 2016-06-22 11:40:19
layout: post
tags: [OCaml, FP, Raspberry Pi]
---
This morning, I wanted to play with my Raspberry Pi which is, since a long time, not used. After downloading the last <a href="https://www.raspberrypi.org/downloads/raspbian/">raspbian image</a> and installing it with dd (see <a href="https://www.raspberrypi.org/documentation/installation/installing-images/README.md">here</a>), I wanted to make some scripts, to do some programming. I read some articles like <a href="https://blogs.janestreet.com/bootstrapping-ocamlasync-on-the-raspberry-pi/">this one from Jane Street</a> installing OCaml on a Raspberry Pi and doing some coding stuff with Async. So, I had my morning project: install OCaml and OPAM on my Raspberry Pi 1 model B+ along with OPAM packages.

## Installing OCaml

The first step is to install some dependencies like git and m4 to be able to install OPAM. Normally, git is pre-installed but not m4.
```bash
sudo apt-get install m4
```

After that, OCaml 4.01.0 has a package and can be installed with apt-get:
```bash
sudo apt-get install ocaml
```

The installation takes a few minutes but after that, we can use OCaml without problem.

<a href="http://blog.danny-willems.be/wp-content/uploads/2016/06/Selection_003.png" rel="attachment wp-att-287"><img src="http://blog.danny-willems.be/wp-content/uploads/2016/06/Selection_003.png" alt="OCaml on Raspberry Pi" width="553" height="110" class="size-full wp-image-287" /></a>

## Clone, compile and install OPAM

It's time to be able to use OPAM to install our favorite packages. We will install OPAM from source to have an optimized installation. We need to configure, install external libraries, compile OPAM before being finally able to install it. All commands are given on the <a href="https://github.com/ocaml/OPAM">official GitHub repository</a>:

```bash
git clone https://github.com/ocaml/OPAM
cd OPAM
./configure
make lib-ext
make
sudo make install
```

Cloning and configuring are fast. The longest steps are installing external libraries and compiling OPAM: it takes several minutes.
If you are using a Raspberry pi 3, which has a quad core CPU, you can use [code lang="bash"]make -j 4[/code].
These commands will install the last version of OPAM (which is for the moment 2.0) but maybe you want OPAM 1.2. In this case, use:

```bash
git clone https://github.com/ocaml/opam
cd OPAM
git checkout -b 1.2 origin/1.2
./configure
make lib-ext
make
sudo make install
```

We also need to launch OPAM init, which takes also several minutes:

```bash
opam init
```

## Install the last OCaml version

Before using any package, I would like to switch to a more recent OCaml version, such as the last release: 4.03.0. We can easily do this with OPAM switch.

```bash
opam switch 4.03.0
```

It takes a very long time because the Raspberry Pi needs to compile OCaml. CPU is always at 100% but it doesn't take too much RAM, the entire system taking 200 MB max. You will be stuck at this step for a long time.

<a href="http://blog.danny-willems.be/wp-content/uploads/2016/06/Selection_004.png" rel="attachment wp-att-293"><img src="http://blog.danny-willems.be/wp-content/uploads/2016/06/Selection_004.png" alt="OPAM switch 4.03.0 stuck" width="651" height="154" class="size-full wp-image-293" /></a>

And after around 1 hour, we have an fresh OCaml 4.03.0 installation on our Raspberry Pi:

<a href="http://blog.danny-willems.be/wp-content/uploads/2016/06/Selection_001.png" rel="attachment wp-att-295"><img src="http://blog.danny-willems.be/wp-content/uploads/2016/06/Selection_001.png" alt="ocaml 4.03.0" width="308" height="64" class="size-full wp-image-295" /></a>

## Install an OPAM package: js_of_ocaml

As a fan of js_of_ocaml, I would like to try it on my Raspberry Pi.

```bash
OPAM install js_of_ocaml
```

Still no issues with the installation but it takes also a long time due to camlp4 in particular but everything is OK, without any memory issue.
