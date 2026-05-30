---
title:
  "How Emacs package installation works: ELPA, MELPA, and a hand-rolled
  allowlist"
author: Danny Willems
date: 2026-05-30 00:00:00 +0000
layout: post
tags: [emacs, package-management, elpa, melpa, configuration, security]
---

This post explains how Emacs installs packages: what ELPA and MELPA actually
are, what happens step by step when a package is installed, and how signature
checking, archive priorities, and pinning fit together. It is a companion to my
earlier write-up on moving to a
[hand-rolled Emacs configuration](https://dannywillems.github.io/blog/2026/05/28/emacs-setup-story/).
Where it helps to be concrete, it refers to my own configuration, the one built
around `early-init.el`, `init.el`, and an explicit list of approved packages.
The configuration is used only as a worked example; none of it is tied to a
particular operating system or desktop environment.

Like the companion post, this article was written with the help of an AI
assistant, working from my own configuration and questions. Treat the
descriptions of that configuration as my claims about my own setup, not as
universal recommendations.

<!--more-->

## package.el is a small apt or npm

Emacs ships with a built-in package manager called `package.el`. Conceptually it
resembles a small clone of `apt` or `npm`:

- An **archive** is a remote HTTP server hosting `.tar` and `.el` files plus an
  index.
- `package.el` downloads the index, resolves dependencies, fetches tarballs,
  unpacks them into a local directory, byte-compiles them, and adds them to the
  `load-path`.
- That local directory is `package-user-dir`, which defaults to
  `~/.config/emacs/elpa/`. This is the folder that fills up with directories
  like `treemacs-20251226.1307/`.

"ELPA" is not a single website. It stands for Emacs Lisp Package Archive, and it
names a format and protocol rather than one server. Any server that speaks that
format is "an ELPA". MELPA, GNU ELPA, and NonGNU ELPA are all different servers
speaking the same protocol.

## the three archives

A configuration declares which archives to use. Mine lists three, in
`early-init.el`:

```elisp
(setq package-archives
      '(("gnu"    . "https://elpa.gnu.org/packages/")
        ("nongnu" . "https://elpa.nongnu.org/nongnu/")
        ("melpa"  . "https://melpa.org/packages/")))
```

The three differ in governance and freshness, not in technical format:

| Archive     | Who runs it           | What it carries                                                                                                      | Versioning                             | Signed    |
| ----------- | --------------------- | -------------------------------------------------------------------------------------------------------------------- | -------------------------------------- | --------- |
| GNU ELPA    | FSF / GNU project     | Packages with copyright assigned to the FSF, including many "built-in but updatable" ones such as `compat` and `org` | Stable, curated releases               | Yes (GPG) |
| NonGNU ELPA | GNU project, looser   | Free-software packages without FSF copyright assignment, for example `evil` and `markdown-mode`                      | Stable releases                        | Yes (GPG) |
| MELPA       | Community (melpa.org) | Almost everything else; built directly from upstream version control                                                 | Rolling, one build per upstream commit | No        |

The practical difference is that MELPA is rolling. A MELPA version like
`treemacs-20251226.1307` is a timestamp: `YYYYMMDD.HHMM` of the upstream commit
it was built from. GNU and NonGNU give semantic releases such as `1.15.0`. This
distinction is the source of most version-skew problems, as the pinning section
below shows.

There is also MELPA Stable (`stable.melpa.org`), which builds from upstream git
tags instead of every commit. The configuration discussed here does not use it.
Plain MELPA means "HEAD of upstream, rebuilt constantly"; MELPA Stable means
"latest tagged release".

## what happens during an install

When something calls `(package-install 'magit)`, this sequence runs:

1. **Refresh the index** (`package-refresh-contents`). For each archive,
   download `ARCHIVE/archive-contents`. That file is one large Lisp form listing
   every package, its version, and its dependencies. Emacs merges all archives
   into `package-archive-contents` in memory.

2. **Pick the source archive.** If a package exists on several archives,
   `package-archive-priorities` decides which one wins:

   ```elisp
   (setq package-archive-priorities
         '(("gnu" . 30) ("nongnu" . 20) ("melpa" . 10)))
   ```

   A higher number wins, so this configuration prefers the signed, stable GNU or
   NonGNU copy and falls back to MELPA only when a package is not on the others.
   A per-package pin (covered below) overrides this.

3. **Resolve dependencies transitively.** `magit` declares dependencies such as
   `magit-section`, `with-editor`, `compat`, `llama`, and `dash`. `package.el`
   computes the full set and installs each one. This step matters for any
   allowlist-based setup, as the later section explains.

4. **Download and verify.** Fetch the `.tar`. If `package-check-signature`
   requires it, verify the detached GPG signature (`.sig`) against the archive's
   key.

5. **Unpack** into `~/.config/emacs/elpa/<name>-<version>/`.

6. **Byte-compile** `.el` to `.elc`, and where native compilation is available,
   native-compile to `.eln`. This is why a "recompile everything" routine has to
   clear both the `.elc` files and the native-comp cache.

7. **Generate autoloads.** Each package ships a `<name>-autoloads.el`. Autoloads
   are stub definitions that say, in effect, "function `magit-status` lives in
   `magit.el`; load that file the first time someone calls it." This is how
   Emacs starts quickly despite dozens of installed packages: at boot it loads
   the autoload stubs, then pulls in the real code lazily on first use.

8. **Record state.** The installed set is tracked in `package-alist` at runtime
   and in `package-selected-packages`, usually persisted in `custom.el`.

## early-init.el and initialization order

There is an ordering subtlety. Historically `package-initialize`, which
activates installed packages and sets up the `load-path`, ran after `init.el`.
Modern Emacs runs it automatically. Anything that has to happen before packages
are touched, for example setting the archive list, the signature policy, or
garbage-collection tuning, must go in `early-init.el`, which runs before package
initialization and before the first frame is drawn. That is why the archive
list, signature policy, and pins all live in `early-init.el` rather than
`init.el`.

## signatures and HTTPS

By default, `package.el` verifies a signature if one is present but silently
accepts unsigned data. The configuration here tightens that:

```elisp
(setq package-check-signature 'all
      package-unsigned-archives '("melpa"))
```

- Every package downloaded from an ELPA can carry a detached GPG signature. GNU
  and NonGNU sign their archives; the signing key comes from the
  `gnu-elpa-keyring-update` package, which keeps the keyring current.
- The Emacs default, `allow-unsigned`, accepts unsigned data without complaint.
  Setting `'all` means "reject anything unsigned." This is intended to defend
  against a tampered mirror or a TLS-stripping middlebox rewriting
  `archive-contents`.
- MELPA does not sign at all, so a blanket `'all` would make MELPA
  uninstallable. The escape hatch is `package-unsigned-archives`, which marks
  MELPA as allowed to be unsigned while keeping `'all` enforcement on GNU and
  NonGNU.

The resulting trust model: GNU and NonGNU are cryptographically verified; MELPA
is trusted on HTTPS transport only. That is one reason a setup like this audits
each MELPA package by hand and records the audit in a comment next to the
package.

## pinning, and why evil is a special case

`package-pinned-packages` forces a specific package to come from a specific
archive, overriding `package-archive-priorities`:

```elisp
(setq package-pinned-packages
      '((evil            . "melpa")
        (evil-collection . "melpa")))
```

This pin prevents a concrete failure. GNU ELPA's `evil` is frozen at `1.15.0`,
but `evil-collection`, which is only on MELPA and rolling, calls symbols that
exist only in `evil` 1.16 or later. Without the pin, priority would pull `evil`
from GNU ELPA (priority 30) and `evil-collection` from MELPA (priority 10),
leaving the two version-skewed: a rolling package depending on a frozen one.
Pinning both to MELPA keeps them in lockstep. This is the canonical hazard of
mixing a rolling archive with a stable one.

## use-package configures, it does not install

```elisp
(require 'use-package)
(setq use-package-always-ensure t)
```

`use-package` is a macro, built into Emacs since version 29. It is not a package
manager. It is a tidy way to express "when this package is present, configure it
like so." A `(use-package magit ...)` block expands into ordinary `setq`,
`require`, hook, and keybinding calls.

The one part that touches installation is `:ensure`. With
`use-package-always-ensure` set to `t`, every block implicitly calls
`package-install` for its package if it is missing. That call still goes through
`package-install`, so it composes with any guard placed around that function:
`use-package` decides what to configure, while an allowlist can decide what is
allowed to install at all.

## how an allowlist hooks into all of this

A security-minded configuration can wrap the install entry points to enforce an
explicit list of approved packages. The package system has five code paths that
can put Lisp into the runtime, and each can be guarded:

- `package-install` (by name): allowlist-checked.
- `package-install-from-archive` (used by the `*Packages*` menu):
  allowlist-checked.
- `package-vc-install` (clone and install straight from a git repository):
  allowlist-checked.
- `package-install-file` (install a local `.el` or `.tar`): hard-blocked.
- `package-install-from-buffer` (evaluate a buffer as a package): hard-blocked.

The reason the allowlist must also include transitive dependencies, such as
`dash`, `compat`, `treepy`, and `llama`, comes from the dependency-resolution
step earlier: installing `magit` calls `package-install` on each of its
dependencies, and the guard intercepts every such call. If `magit` is approved
but `llama` is not, installing `magit` aborts the moment it tries to pull
`llama`. That is the intended behaviour: nothing enters the tree without an
explicit, auditable line.

## VC packages and native git checkouts

One archive type is worth calling out separately. `package-vc-install` skips
archives entirely and clones a package straight from its upstream git repository
into `elpa/`, leaving a real `.git` directory inside. These cannot be upgraded
the same way as archive packages; updating one means deleting the checkout and
re-cloning, which is why update routines treat VC packages as a separate case.
An `elpa/` directory can therefore hold a mix of archive-installed packages
(plain directories) and VC-installed ones (directories with `.git`).

## the lifecycle, end to end

Putting it together, here is a cold boot on this kind of setup:

1. `early-init.el` sets the archives, priorities, signature policy, pins, and
   garbage-collection tuning.
2. `package.el` auto-initializes: it activates whatever is already in `elpa/`
   and builds the `load-path` from autoloads.
3. `init.el` loads the package module, which installs the allowlist guards and
   then, for any approved package not yet on disk, refreshes contents and
   installs it (signature-checked per archive, allowlist-checked per the guard).
4. Remaining modules load; `use-package` blocks configure each now-present
   package and wire up lazy autoloads.
5. The first time a key bound to, say, `magit-status` is pressed, the autoload
   fires and the real `magit.el`, with its native-compiled `.eln`, loads.

## quick reference

- An **archive** is a remote ELPA server; `package-user-dir` is the local
  `elpa/` install directory.
- **GNU and NonGNU** are stable and signed; **MELPA** is rolling and unsigned.
- `package-archive-priorities` picks the source; `package-pinned-packages`
  overrides it per package.
- `package-check-signature` is the GPG trust knob; the setup here runs `'all`
  with a MELPA exception.
- `package.el` installs and resolves dependencies; `use-package` only
  configures, with an optional `:ensure` install.
- Dependencies install automatically, which is why an allowlist has to name them
  too.
