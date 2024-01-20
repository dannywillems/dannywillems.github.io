---
layout: post
title: The Rekt test, revisited
date: 2024-01-20 11:02:36 +0000
author: Danny Willems
tags: [security, offsec, rekt test]
---

This document will evolve over the years.
It will describe security practices that I would recommend to use in company
projects.


## Code related

- Each engineer must sign each commit.
  - See https://docs.github.com/en/authentication/managing-commit-signature-verification/telling-git-about-your-signing-key
  - See https://docs.github.com/en/authentication/managing-commit-signature-verification/generating-a-new-gpg-key
  - Enough security must be set for the key. Ed25519 is a personal taste at the
    moment. It must follow the latest recommendations in terms of key size.
  - The GPG key used to sign must be protected by a strong enough password.
- The Vigilan mode available [on GitHub](https://github.com/settings/keys) must
  be activated. It will flag unverified commit with `unverified` in yello (at the time of writing).
- A hash of each dependency must be defined in the repository. The package
  manager must verify the hash corresponds to the actual tarball downloaded.
- Changes must be as small as possible. Commits must be self-explained. The
  first 80 characters of the commit must contain a brief description of the
  changes, followed by an empty line, and the next lines can contain a deeper
  explanation. Note that on GitHub, the first line of the commit will be
  automatically used as a title for a pull request and the rest of the commit
  message will be used as the pull request description.
  Keeping pull request description in the git history allows to keep
  explanations even if the hosting platform goes offline.

## Other related documents

- [The Rekt test](https://blog.trailofbits.com/2023/08/14/can-you-pass-the-rekt-test/)
