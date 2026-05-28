---
title: Hardening a hand-rolled Emacs config: five findings and their fixes
author: Danny Willems
date: 2026-05-28 00:00:00 +0000
layout: post
tags: [emacs, security, supply-chain, ai, claude-code]
---

This post is an educational walkthrough of a small security review I ran on my
own Emacs configuration, and the five fixes that came out of it. The target is
anyone running a hand-rolled `init.el` rather than a managed distribution; Doom
and Spacemacs users will recognise some of the patterns but the fixes assume a
small, owned config you can edit freely.

A note on how this was written: the review was performed with the help of an AI
coding assistant, which produced an internal decision log describing each
finding, the chosen fix, and the residual risk. This article was then generated
from that decision log, also with AI assistance. The point of mentioning it is
not novelty; it is that "AI wrote the article" should not exempt the underlying
claims from the usual scrutiny. If something below looks wrong, it probably is,
and I would like to hear about it.

## threat model in one paragraph

A single-user developer laptop. The threats that matter are: supply-chain
compromise of a package or grammar repository, accidental plaintext leakage of
secrets via editor side channels (auto-save, recentf, lockfiles), and a
third-party process (LSP server, package post-install script) using its
writeable view of the filesystem in ways the user did not consent to. Multi-user
hosts and active network attackers on the package archives are secondary, but
the fixes below help against them too.

## 1. the allowlist that was mostly theatre

A common pattern in hardened Emacs configs is to declare an `approved-packages`
list and refuse to install anything outside it, typically by adding advice (see
[Advising Named Functions](https://www.gnu.org/software/emacs/manual/html_node/elisp/Advising-Named-Functions.html))
on `package-install` (see
[Package Installation](https://www.gnu.org/software/emacs/manual/html_node/emacs/Package-Installation.html)
in the Emacs manual for what `package-install` and its companions do):

```elisp
(defvar my/approved-packages '(magit vertico consult ...))

(advice-add 'package-install :before #'my/guard-package-install)
```

The goal is a reviewable manifest of every dependency. The problem is that
`package-install` is one of five install entry points in Emacs. The others were
unguarded in my config and are unguarded in most public examples (behaviour of
each entry point is documented in the package.el source and the user manual
section linked above):

- `package-install-from-archive` takes a `package-desc` object and is reachable
  from `package-menu-mode` actions (see
  [Package Menu](https://www.gnu.org/software/emacs/manual/html_node/emacs/Package-Menu.html))
  and from third-party code.
- `package-install-file` loads a `.el` or `.tar` from disk with no provenance
  check (see
  [Package Files](https://www.gnu.org/software/emacs/manual/html_node/emacs/Package-Files.html)).
- `package-install-from-buffer` evaluates the current buffer as a package
  definition (same manual section).
- `package-vc-install` clones a VCS URL and installs from the working tree (see
  [Fetching Package Sources](https://www.gnu.org/software/emacs/manual/html_node/emacs/Fetching-Package-Sources.html)).

Any of these silently bypassed the allowlist. The "policy" was a polite
suggestion.

The fix has two parts. First, generalise the guard function so it can extract
the package name from the four argument shapes (`package-desc`, symbol, string,
cons) used by the name-taking entry points, and add advice to all of them:

```elisp
(dolist (fn '(package-install
              package-install-from-archive
              package-vc-install))
  (advice-add fn :before #'my/guard-package-install))
```

Second, hard-block the two entry points that cannot meaningfully consult an
allowlist, because the package identity is only knowable after parsing arbitrary
content:

```elisp
(dolist (fn '(package-install-file
              package-install-from-buffer))
  (advice-add fn :override #'my/guard-blocked-install))
```

The policy is now: if you really need one of these, remove the advice
intentionally for the duration of the install.

The general lesson: the right unit for an allowlist is the install _action_, not
the install _function_. Listing one symbol and calling it a policy is a common
pattern that does not survive contact with the rest of the package system.

## 2. auto-save was leaking secrets

The config sets `auto-save-default t` and redirects every auto-save target into
a single directory under `~/.config/emacs/auto-saves/`. That is a sensible
default for crash recovery on source files. See
[Auto Save](https://www.gnu.org/software/emacs/manual/html_node/emacs/Auto-Save.html)
in the Emacs manual for the full semantics, and
[Auto-Saving in the Elisp manual](https://www.gnu.org/software/emacs/manual/html_node/elisp/Auto_002dSaving.html)
for the variables and functions involved.

The problem is the trigger condition described there: auto-save applies to any
buffer visiting a file. Editing `~/.ssh/id_ed25519`, a `~/.gnupg/*.gpg` file, a
`.env`, `~/.aws/credentials`, or a `pass(1)` entry produces a plaintext mirror
in the auto-save directory. The auto-save file persists until the source is
saved cleanly; if Emacs crashes or the buffer is killed, the plaintext can stay
on disk indefinitely. None of these paths were excluded.

Note that `make-backup-files nil` (see
[Backup Files](https://www.gnu.org/software/emacs/manual/html_node/emacs/Backup.html))
was already set globally, so backups were not the issue. The bug was the
asymmetry between "never write backups" and "silently mirror every keystroke for
crash recovery."

The fix defines a reusable pattern list and a hook that disables the three
relevant features for any file matching it:

```elisp
(defvar my/sensitive-file-patterns
  '("/\\.gnupg/" "/\\.ssh/id_" "/\\.password-store/"
    "/\\.aws/" "/\\.kube/" "/\\.docker/config\\.json\\'"
    "/\\.netrc\\(\\.gpg\\)?\\'"
    "/\\.authinfo\\(\\.gpg\\)?\\'"
    "/\\.pypirc\\'"
    "/\\.env\\(\\.[A-Za-z0-9_.-]+\\)?\\'" "/\\.envrc\\'"
    "/secrets\\."
    "\\.gpg\\'" "\\.pem\\'" "\\.key\\'" "\\.asc\\'"))

(defun my/sensitive-file-p (path)
  (and path
       (cl-some (lambda (re) (string-match-p re path))
                my/sensitive-file-patterns)))

(defun my/disable-saves-for-sensitive ()
  (when (my/sensitive-file-p buffer-file-name)
    (auto-save-mode -1)
    (setq-local make-backup-files nil)
    (setq-local create-lockfiles nil)))

(add-hook 'find-file-hook #'my/disable-saves-for-sensitive)
```

The pattern list is the single source of truth; it is reused for recentf
filtering in the next section. The hook runs at `find-file` time (see
[`find-file-hook` in Visiting Functions](https://www.gnu.org/software/emacs/manual/html_node/elisp/Visiting-Functions.html))
so the buffer-local kill switches are set before the first auto-save timer can
fire. `create-lockfiles` is documented in
[File Locks](https://www.gnu.org/software/emacs/manual/html_node/emacs/Interlocking.html).

Cleanup note: the patch only changes future behaviour. Existing leaks under the
auto-save directory predate it. A
`find ~/.config/emacs/ auto-saves -type f -print` and manual review is required,
and the contents should be shredded rather than just deleted.

"Defence in depth" should start with the easiest leak surface and work outward.
Auto-save qualifies because almost nobody thinks of it. A useful side effect:
the same predicate feeds three other defences (backups, lockfiles, recentf) so
the cost of getting the pattern list right is paid once.

## 3. recentf was unfiltered

`recentf-mode` persists the recent file list to `~/.config/emacs/ recentf.eld`
across sessions. See
[File Conveniences](https://www.gnu.org/software/emacs/manual/html_node/emacs/File-Conveniences.html)
in the Emacs manual for the mode itself and the `recentf-exclude` variable. The
persisted list is the source for `consult-recent-file` (third-party, see the
[consult README](https://github.com/minad/consult)) and similar completion
commands.

`recentf-exclude` was unset. Every file opened got serialised to plaintext in
`recentf.eld`, including paths to GPG-encrypted files, password store entries,
and credential files. The list leaks via shoulder-surfing, backups of the Emacs
config directory, or accidental commit of `recentf.eld` to a dotfiles
repository.

The fix reuses the pattern list from the auto-save section and appends common
noise paths:

```elisp
(with-eval-after-load 'recentf
  (setq recentf-exclude
        (append my/sensitive-file-patterns
                '("/tmp/" "/var/folders/" "/auto-saves/"
                  "/elpa/" "\\.elc\\'"
                  "/COMMIT_EDITMSG\\'" "/MERGE_MSG\\'"))))
```

Cleanup note: `recentf.eld` already contains historical entries. Delete the file
once, restart Emacs, and let `recentf` rebuild under the new exclusion rules.

The general lesson: persistence is the threat. Anything Emacs writes under its
config directory should be considered for confidentiality, not just durability.
`recentf`, `savehist`, `places.eld`, bookmarks, and `org-roam.db` all fall in
this bucket.

## 4. no GPG signature verification on package archives

`package-archives` was set to GNU ELPA, NonGNU ELPA, and MELPA over HTTPS, with
priorities (`package-archive-priorities`) so the GNU archives win when a package
is available in both. TLS protects integrity in transit. See
[Package Installation](https://www.gnu.org/software/emacs/manual/html_node/emacs/Package-Installation.html)
in the Emacs manual for the archive list and the signature variables referenced
below.

`package-check-signature` defaults to `allow-unsigned`, as documented in that
section. GNU and NonGNU ELPA do publish detached signatures, but with the
default Emacs accepts the archive even when unsigned. A compromised TLS
terminator, a malicious mirror, or a CA-level downgrade attack could deliver a
different `archive-contents` payload than the one the archive maintainers
signed, and Emacs would install from it without comment. MELPA is not signed and
cannot be brought under this control; that risk stays.

The fix lives in `early-init.el`:

```elisp
(setq package-check-signature 'all
      package-unsigned-archives '("melpa"))
```

And `gnu-elpa-keyring-update` is added to the approved-packages list so the GNU
ELPA signing keyring is refreshed automatically rather than shipped once with
Emacs and never updated.

Two caveats worth documenting up front, because they are the reason most people
skip this step:

- Setting `'all` requires a working `gpg` on `PATH`. On bare systems, install
  `gnupg` first.
- The first `package-refresh-contents` after this change can fail if the local
  keyring is stale relative to a rotated GNU ELPA key. `gnu-elpa-keyring-update`
  is the steady-state fix, but it is itself fetched from GNU ELPA, so the
  bootstrap is circular. The standard workaround is to import the latest key by
  hand once:

  ```bash
  gpg --homedir ~/.config/emacs/elpa/gnupg \
      --keyserver hkps://keys.openpgp.org \
      --recv-keys <current GNU ELPA key fingerprint>
  ```

The most-repeated Emacs hardening tip on the internet ("refuse to install
unsigned packages") is one line of config that almost nobody actually applies.
The reason is the bootstrap pain. It is worth documenting that pain rather than
pretending it does not exist.

## 5. tree-sitter grammars on moving branches

`treesit-language-source-alist` declares the source for each grammar.
`treesit-install-language-grammar` clones the URL, optionally checks out a
revision, compiles the C source with the system toolchain, and loads the
resulting `.so` into Emacs. The shared object then runs in-process. See
[Parsing Program Source](https://www.gnu.org/software/emacs/manual/html_node/elisp/Parsing-Program-Source.html)
and the `treesit-install-language-grammar` docstring
(`C-h f treesit-install-language-grammar`) for the exact contract, including
which arguments select revision and source subdirectory.

In my config, twelve of fourteen entries had no revision specified, so each
install tracked the upstream default branch. Two of the remaining pinned
`"master"`, which is the same thing under a different spelling. A compromised
upstream repository (account takeover, typosquat redirect, contributor with push
access pushing once and force-pushing it away) would land arbitrary C in the
editor on the next reinstall, with no diff to review.

This is a strict subset of the package supply-chain problem, but worse:
tree-sitter grammar repositories rarely cut releases, almost never sign tags,
and live outside the package archives' review process.

The fix pins every grammar to a specific commit SHA, observed at the time of the
patch. The alist entry format extends from `(LANG URL)` to
`(LANG URL REVISION [SOURCE-DIR])`. SHAs were collected by parallel
`git ls-remote URL HEAD` and pasted verbatim. The file now serves as a manifest:
any future bump requires an explicit SHA change in git history, with a reviewer.

Cleanup note: pinning only affects future installs. Already-installed grammars
stay at whatever commit they were originally fetched from. If you cannot account
for them, delete the cached `.so` files and rerun the install function.

The same SHA-pinning argument used for GitHub Actions, npm lockfiles, and Docker
image digests applies here. Tree-sitter grammars are an underappreciated
supply-chain entry point because "it is just a parser" sounds harmless, but a C
compiler is invoked on whatever the repository says it should be invoked on.

## related cleanup: removing yasnippet and yasnippet-snippets

In the same session I decided to drop both packages.

- `yasnippet-snippets` is a community blob whose snippets can embed
  backtick-expanded Lisp evaluated at expansion time. Each snippet is
  effectively unaudited code with `eval` rights.
- `yasnippet` itself was unused day to day.

If snippet behaviour is needed again, `tempel` is a lighter replacement:
declarative, no eval-on-expand surface.

## follow-ups left for another day

The review identified items that did not make it into this round of fixes:

- Audit and shred existing leaks under the auto-save directory and the old
  `recentf.eld`.
- Add an `eglot-confirm-server-edits` policy (see the
  [Eglot manual](https://www.gnu.org/software/emacs/manual/html_mono/eglot.html))
  so language servers cannot silently rewrite files outside the active buffer.
- Replace `(setenv "PATH" ...)` (see
  [System Environment](https://www.gnu.org/software/emacs/manual/html_node/elisp/System-Environment.html))
  clobbering with merge semantics or
  [`exec-path-from-shell`](https://github.com/purcell/exec-path-from-shell).
- Switch `vc-follow-symlinks` from `t` to `'ask`; the variable is described in
  [Following Links](https://www.gnu.org/software/emacs/manual/html_node/emacs/Following-Links.html).
- Reduce `gc-cons-threshold` from 400 MB after startup to 32 MB; see
  [Garbage Collection](https://www.gnu.org/software/emacs/manual/html_node/elisp/Garbage-Collection.html)
  for the trade-off.

## a note on using AI for this kind of work

The decision log this article was generated from is a structured artifact, not a
chat transcript. For each finding it records the motivation, the precise
problem, the fix applied, the residual cleanup, and an angle worth writing
about. The reason that format is useful is that a security review tends to
produce findings faster than a human can write them up, and an unwritten finding
is half a finding: the fix lands, the reasoning evaporates, and six months later
the same class of bug walks back in because nobody remembers why the guard
exists.

Using AI to generate the prose from a decision log shifts the cost. The
expensive work is the review and the structured log. The article is a projection
of that log into a different medium. The AI is good at the projection and
indifferent to the underlying claims, which is exactly why the log has to be
precise: any sloppiness in the inputs becomes confident prose in the output.

If you adopt a similar workflow, two suggestions. Keep the decision log under
version control so the article can cite specific commits. And do not let the
article be the only artifact: the log is the durable record, the article is the
shareable summary.
