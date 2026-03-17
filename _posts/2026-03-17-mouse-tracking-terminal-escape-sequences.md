---
title: Mouse tracking in the terminal with escape sequences
author: Danny Willems
post_date: 2026-03-17 00:00:00
layout: post
tags: [terminal, xterm, escape-sequences, linux]
---

Terminal emulators can report mouse events (clicks, movement, scroll) to
programs running inside them. The mechanism relies on xterm-style escape
sequences that toggle different tracking modes. Most modern terminals support
them: xterm, iTerm2, Alacritty, kitty, foot, WezTerm, Windows Terminal, etc.

This post is a compact reference for enabling, reading, and disabling mouse
tracking from the shell or any language that can write to stdout.

---

# The tracking modes

xterm defines several mouse tracking modes, each identified by a DEC private
mode number toggled with `CSI ? <n> h` (enable) and `CSI ? <n> l` (disable).

| Mode                  | Number | What it reports                                            |
| --------------------- | ------ | ---------------------------------------------------------- |
| Normal tracking       | 1000   | Button press and release                                   |
| Highlight tracking    | 1001   | Highlight regions (rarely used)                            |
| Button-event tracking | 1002   | Press, release, and motion while a button is held          |
| Any-event tracking    | 1003   | Press, release, and **all** motion (even without a button) |

There is also a set of **encoding modes** that change how coordinates are
transmitted:

| Encoding          | Number    | Details                                                                        |
| ----------------- | --------- | ------------------------------------------------------------------------------ |
| X10 compat        | (default) | Coordinates encoded as `byte = 32 + value`. Breaks above column/row 223.       |
| UTF-8             | 1005      | Extends range via UTF-8 encoding. Still has edge cases.                        |
| SGR (recommended) | 1006      | Reports as `CSI < button ; col ; row M` or `m`. No upper limit on coordinates. |
| urxvt             | 1015      | Decimal encoding. Less widely supported than SGR.                              |

In practice you almost always want **1003** (any-event) combined with **1006**
(SGR encoding).

---

# Enable mouse tracking

```bash
# Enable any-event tracking + SGR encoding
printf '\e[?1003h\e[?1006h'
```

`\e[?1003h` tells the terminal "send me every mouse event". `\e[?1006h` tells it
"use SGR encoding so coordinates are not limited to 223".

After this, every mouse action produces an escape sequence on stdin.

---

# Read the events

With SGR encoding enabled, events look like this:

```
ESC [ < button ; column ; row M      (press or motion)
ESC [ < button ; column ; row m      (release)
```

- `button` is a bitmask: 0 = left, 1 = middle, 2 = right, 32 = motion, 64 =
  scroll up, 65 = scroll down. Modifiers add flags (4 = shift, 8 = meta, 16 =
  control).
- `column` and `row` are 1-based.
- Capital `M` means press/motion, lowercase `m` means release.

A minimal shell reader:

```bash
#!/usr/bin/env bash
# Enable tracking
printf '\e[?1003h\e[?1006h'

# Restore on exit
trap 'printf "\e[?1000l\e[?1002l\e[?1003l\e[?1006l"' EXIT

# Raw mode so we get bytes immediately
stty -echo -icanon min 1

while IFS= read -r -n 1 ch; do
  # Look for ESC
  if [[ "$ch" == $'\e' ]]; then
    # Read rest of the sequence
    seq=""
    while IFS= read -r -n 1 -t 0.01 next; do
      seq+="$next"
      # SGR mouse sequences end with M or m
      [[ "$next" == [Mm] ]] && break
    done
    echo "got: ESC${seq}"
  fi
done
```

Run it, move the mouse around the terminal, click, scroll. You will see a stream
of parsed sequences.

---

# Disable mouse tracking

Always clean up when your program exits. Leaving tracking enabled makes the
terminal dump escape codes on every mouse move, which is not fun.

```bash
printf '\e[?1000l\e[?1002l\e[?1003l\e[?1006l'
```

This disables all four common tracking modes at once. It is safe to disable
modes that were never enabled.

Use a `trap` in shell scripts so cleanup happens even on SIGINT/SIGTERM:

```bash
cleanup() {
  printf '\e[?1000l\e[?1002l\e[?1003l\e[?1006l'
  stty sane
}
trap cleanup EXIT
```

---

# Quick copy-paste reference

```bash
# Enable (any-event + SGR)
printf '\e[?1003h\e[?1006h'

# Disable (all modes)
printf '\e[?1000l\e[?1002l\e[?1003l\e[?1006l'
```

---

# Common pitfalls

1. **Forgetting to disable on exit.** If your program crashes without cleanup,
   run `printf '\e[?1000l\e[?1002l\e[?1003l\e[?1006l'` manually or type `reset`.

2. **Not using SGR encoding.** Without mode 1006, coordinates above 223 wrap
   around or get garbled. Always enable SGR when you enable tracking.

3. **Tmux/screen layers.** Tmux intercepts mouse events by default
   (`set -g mouse on`). If your program does not receive events, check whether
   the multiplexer is eating them.

4. **SSH sessions.** Mouse tracking works over SSH as long as the local terminal
   supports it. The escape sequences travel through the PTY layer transparently.

---

# Further reading

- [XTerm Control Sequences](https://invisible-island.net/xterm/ctlseqs/ctlseqs.html),
  section "Mouse Tracking"
- The source code of [tui-rs](https://github.com/fdehau/tui-rs) and
  [crossterm](https://github.com/crossterm-rs/crossterm) for how Rust TUI
  libraries handle mouse input
- `man 4 console_codes` on Linux for the kernel console subset
