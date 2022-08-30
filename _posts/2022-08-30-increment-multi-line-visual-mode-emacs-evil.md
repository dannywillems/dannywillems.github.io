---
ID: 548
title: Compile libxml2 on MacOS
author: Danny Willems
post_date:2022-08-30 17:16:00
post_excerpt: ""
layout: post
published: true
tags: [evil, emacs, visualmode, increment numbers]
---

It often happens you must use the multi column feature in Emacs/vim to modify
multiple lines at the same time on the same column. You may also need to increase on each line a number.
You want to duplicate the line
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
4. Use `CTRL-v` on the number `1` on the second line to select multiple columns with the numbers after `x`.
5. Use `M-x evil-numbers/inc-at-pt-incremental`
6. Repeat for `u` and `v`
