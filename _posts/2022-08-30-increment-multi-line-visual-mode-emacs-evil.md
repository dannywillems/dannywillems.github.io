---
layout: post
title: Increment numbers in visual mode with Emacs and the multi-column feature
date: 2022-08-30 17:16:00 +0200
author: Danny Willems
tags: [evil, emacs, visualmode, increment numbers, RSS]
---

It often happens you must use the multi column feature in Emacs/vim to modify
multiple lines at the same time on the same column. You may also need to
increase on each line a number. You want to duplicate the line

```
let x1 = u1 * v1;
```

to become

```
let x1 = u1 * v1;
let x2 = u2 * v2;
let x3 = u3 * v3;
let x4 = u4 * v4;
```

evil-number provides a function called `evil-numbers/inc-at-pt-incremental`.

1. Go on the line you want to duplicate.
2. Yank the line: `yy`
3. Paste 3 times the line: `3p`
4. Use `CTRL-v` on the number `1` on the second line to select multiple columns
   with the numbers after `x`.
5. Use `M-x evil-numbers/inc-at-pt-incremental`
6. Repeat for `u` and `v`
