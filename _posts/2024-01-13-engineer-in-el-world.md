---
layout: post
title: Engineering in the el world
date: 2024-01-13 10:02:36 +0000
author: Danny Willems
tags: [emacs, el, bytecode, compile]
---

Today I started to go through some Emacs plugin repositories that I use and try to fix some warnings.
In particular, I want to try copilot in Emacs.
I found [copilot.el](https://github.com/copilot-emacs/copilot.el/).
There are some warnings in Emacs 29.1, like docstring.

Some hints:
- compile the current buffer with `M-x byte-compile-file`.
- Use the repository as an additional package in Spacemacs using
```
(copilot :location (recipe :fetcher github :repo "copilot-emacs/copilot.el" :files ("*.el" "dist")))
```

This is for repositories located on GitHub.
See [melpa recipe](https://github.com/melpa/melpa#recipe-format) for any other
format.
On my side, I'm gonna use a fork on the main repositories until the PRs are merged.
For this, I use:
```
(copilot :location (recipe :fetcher github :repo "dannywillems/copilot.el" :branch "dw/main" :files ("*.el" "dist")))
```
It is essentially the main branch with all PRs merged.

Results of the day regarding el engineering:
- trying to use, again, VSCode. I learnt how to use CTRL+SHIFT+P to access the configuration list. Switched to WINDOWS-X as in Spacemacs.
- I noticed I wanted to switch to VSCode only for Copilot. Therefore, I thought about integrating it in Emacs.
- Found copilot.el
- Fixing some warnings and aesthetic changes, see
  https://github.com/copilot-emacs/copilot.el/pull/234,
  https://github.com/copilot-emacs/copilot.el/pull/235,
  https://github.com/copilot-emacs/copilot.el/pull/236,
  https://github.com/copilot-emacs/copilot.el/pull/237,
  https://github.com/copilot-emacs/copilot.el/pull/238,
  https://github.com/copilot-emacs/copilot.el/pull/239,
  https://github.com/copilot-emacs/copilot.el/pull/240
- I updated copilot.el to use copilot.vim:
  https://github.com/copilot-emacs/copilot.el/pull/240. I don't know if it is
  simply updating the dist directory. I'll try for some days/weeks.

This article might be updated in the future.
