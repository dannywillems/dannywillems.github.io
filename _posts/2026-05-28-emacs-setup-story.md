---
title: From Spacemacs to a small hand-rolled Emacs: why and what is in it
author: Danny Willems
date: 2026-05-28 00:00:00 +0000
layout: post
tags: [emacs, spacemacs, configuration, ai, claude-code]
---

This is a companion to my [Emacs security hardening
post]({% post_url 2026-05-28-emacs-security-hardening %}). That post described
five fixes I applied to my Emacs configuration. This one explains the
configuration itself: why it is hand-rolled rather than a managed distribution,
what categories of dependencies it pulls in, and why each of them earns its
place.

Like the hardening post, this article was written with the help of an AI
assistant. The config was also rewritten in conversation with the same
assistant, in the sense that I drove the design decisions and the assistant
filled in the elisp, then audited the result. Treat the descriptions below as my
own claims about my own setup, not as universal recommendations.

## why move off Spacemacs

I used [Spacemacs](https://www.spacemacs.org/) for years. It is a good on-ramp:
you get a coherent set of defaults, evil-mode integration, and ready-made
"layers" for most languages. The trade-offs that pushed me away were not bugs in
Spacemacs, they were structural:

- **Dependency count.** A Spacemacs install with a handful of language layers
  typically pulls in well over a hundred packages from MELPA. I did not write
  any of those packages, and on a fresh machine I had no practical way to know
  which ones had been added by which layer, or whether any of them had been
  updated to a version with a regression. This is the same supply-chain concern
  that motivates SHA-pinning in any other ecosystem; in Spacemacs the surface is
  just larger.
- **Indirect control.** Configuring a behaviour in Spacemacs often means setting
  a variable that a layer reads, which then sets the variable Emacs actually
  reads. When something breaks, the stack trace has to be unwound through layer
  code that I did not write. Applying a security policy like the
  `package-install` allowlist described in the hardening post is much harder
  when the install decisions are made several abstractions away.
- **Startup cost.** Even with lazy-loading, a Spacemacs session takes noticeably
  longer to come up than a small `init.el` that loads only what I use.
- **Documentation drift.** Spacemacs documentation is good, but it describes
  Spacemacs, not Emacs. After enough years in it I realised I knew the Spacemacs
  keybinding layer better than the underlying Emacs primitives. That is a fine
  trade-off until you need to debug something below the layer.

None of this is an argument that Spacemacs is bad. It is an argument that, once
you have used Emacs long enough to know what you actually need, a hand-rolled
config gives you control proportional to the time you put in. If you do not want
that trade-off, stay with the distribution; it exists for good reasons.

## the design rules

The new config follows three rules that fall out of the points above:

1. **Every package is on an explicit allowlist.** The list lives in one variable
   in one file. If a package is not on the list, `package-install` refuses to
   install it. The hardening post explains how this is enforced against the five
   different install entry points.
2. **Every file is small and focused.** The config is split into a handful of
   modules (`core`, `editing`, `packages`, `treesit`, and a couple more) each
   under a few hundred lines. No module touches a concern that belongs in
   another.
3. **Every non-obvious choice is documented in a comment that says why.** "Why"
   not "what": the elisp itself describes the behaviour; the comment exists to
   explain the trade-off that motivated it.

These rules are mundane. They are also the rules I never managed to apply
consistently inside a layer system.

## what is actually in the config

Rather than enumerate every package, here are the categories the config needs
and the choices it makes for each. The names below are the ones that actually
appear in my allowlist, not generic recommendations.

### the package manager: package.el, not straight.el

Emacs ships with
[`package.el`](https://www.gnu.org/software/emacs/manual/html_node/emacs/Packages.html)
since version 24. It is built-in, it supports signed archives, and the allowlist
enforcement described in the hardening post hooks directly into its install
entry points.

[`straight.el`](https://github.com/radian-software/straight.el) is a popular
alternative that clones from VCS rather than downloading from ELPA. It has nice
properties (reproducible by-commit installs, easy forking) but the trade-off is
that you are now responsible for trusting each upstream repository directly, and
the package-signing infrastructure on GNU ELPA does not apply. I chose
`package.el` because the signature verification chain is something I want to
lean on, not bypass.

### the archives: GNU ELPA, NonGNU ELPA, and MELPA

[GNU ELPA](https://elpa.gnu.org/) and [NonGNU ELPA](https://elpa.nongnu.org/)
ship signed packages with copyright assignment requirements (GNU) or relaxed
requirements (NonGNU). Both are maintained by the Emacs project itself.

[MELPA](https://melpa.org/) is the community archive. It is much larger, not
signed, and ships from upstream repositories on a recipe basis. It is also where
most third-party packages live, so excluding it entirely is not realistic.

The config sets `package-archive-priorities` so that GNU and NonGNU win when a
package is available in multiple archives, and uses `package-unsigned-archives`
to opt MELPA out of signature checking while keeping it on for the others. That
part is described in detail in the hardening post.

### keyring maintenance: gnu-elpa-keyring-update

GNU ELPA rotates its signing key periodically. The
[`gnu-elpa-keyring-update`](https://elpa.gnu.org/packages/gnu-elpa-keyring-update.html)
package keeps the local keyring in sync. Without it, the first refresh after a
key rotation fails and the user is left to import the new key by hand. It is one
of the few packages whose only job is to keep another piece of infrastructure
from breaking.

### completion: vertico, marginalia, consult, orderless, embark

The Spacemacs default is `helm` or `ivy`. The hand-rolled config uses the
[vertico/consult/orderless](https://github.com/minad/vertico) stack instead,
which is smaller and composes through standard Emacs completion APIs rather than
replacing them:

- [`vertico`](https://github.com/minad/vertico) is the minibuffer UI. It is tiny
  (around 700 lines of elisp) and only changes how completion candidates are
  displayed.
- [`marginalia`](https://github.com/minad/marginalia) adds annotations (file
  sizes, docstrings) next to candidates.
- [`consult`](https://github.com/minad/consult) provides commands that use the
  completion UI for things like `consult-recent-file`, `consult-buffer`, and
  `consult-ripgrep`.
- [`orderless`](https://github.com/oantolin/orderless) replaces Emacs's prefix
  matching with space-separated literal/regexp components.
- [`embark`](https://github.com/oantolin/embark) adds context-sensitive actions
  on the current candidate.

Total install size is a fraction of `helm`, and each piece works without the
others if you want to drop one.

### LSP: eglot, not lsp-mode

Emacs 29 ships
[`eglot`](https://www.gnu.org/software/emacs/manual/html_mono/eglot.html) as a
built-in. It is the smaller of the two mainstream LSP clients (the other being
[`lsp-mode`](https://emacs-lsp.github.io/lsp-mode/)) and it follows the LSP spec
rather than extending it. The hardening post lists `eglot-confirm-server-edits`
as a follow-up: it controls whether the server can rewrite files outside the
active buffer without prompting.

### tree-sitter: built-in, with pinned grammars

Emacs 29 also ships
[built-in tree-sitter support](https://www.gnu.org/software/emacs/manual/html_node/elisp/Parsing-Program-Source.html).
The config declares 14 grammar sources in `treesit-language-source-alist`, each
pinned to a commit SHA. The reason for pinning is covered in detail in the
hardening post.

### git: magit

[`magit`](https://magit.vc/) is the part of the config that survives every
rewrite. It is the package I would keep if I could only keep one, because
nothing in or outside Emacs comes close to its commit-staging interface.

### snippets: tempel (replacing yasnippet)

[`yasnippet`](https://github.com/joaotavora/yasnippet) and its companion
[`yasnippet-snippets`](https://github.com/AndreaCrotti/yasnippet-snippets) were
dropped in the same session as the hardening work. `yasnippet-snippets` ships
community snippets that can embed backtick-expanded Lisp evaluated at expansion
time, which is a small but real `eval` surface.
[`tempel`](https://github.com/minad/tempel) is the declarative replacement and
does not have that property.

### what is deliberately not in the config

A few categories that Spacemacs ships by default were not carried over:

- **`evil-mode`.** I no longer use modal editing. If I did, evil would go back
  in.
- **`projectile`.** `project.el` (built-in since Emacs 27) covers the small set
  of project-aware commands I actually use.
- **`flycheck`.** `flymake` (built-in) is enough when eglot is doing the heavy
  lifting.
- **`company`.** `corfu` (a vertico-family completion-at-point UI) is on the
  allowlist instead, for the same "small and composes through standard APIs"
  reason as vertico.

Each of these is a fine choice for someone else's setup. The point is that the
decision to include or exclude each one is now visible in a file I own, rather
than being a side effect of which layers are enabled.

## the value of writing this down

The most underrated benefit of moving to a hand-rolled config is not the
performance or the security posture. It is that the act of writing the config
forces a decision on every line. In a layer-based system, "I have package X
because layer Y added it" is a normal answer. In a hand-rolled system, the
answer has to be "I have package X because it solves problem Z, and the
alternatives are W and V." That is a healthier relationship to your editor.

If you are coming from Spacemacs and considering the same move, the honest
advice is: do not rush it. The migration is worth doing once you already know
which 80% of your Spacemacs setup you actually use. Before that point, you will
spend more time rebuilding muscle memory than you save.
