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
This article will also complete the previous one [You said bugs? Key points I
have learned over the years in FOSS
developments](https://dannywillems.github.io/2023/12/08/you-said-bugs.html).

## Code related

- Each engineer must sign every commit.
  - See [GitHub's
    documentation](https://docs.github.com/en/authentication/managing-commit-signature-verification/telling-git-about-your-signing-key)
    for guidance on signing commits.
  - See [GitHub's
    guide](https://docs.github.com/en/authentication/managing-commit-signature-verification/generating-a-new-gpg-key)
    on generating a new GPG key.
  - Ensure the key adheres to the latest recommendations, with Ed25519 being a
    current personal preference. The key should follow the latest
    recommendations for key size, and the GPG key used for signing must be
    protected by a robust password.
- Activate Vigilan mode on GitHub, accessible
  [here](https://github.com/settings/keys). This mode flags unverified commits
  with `unverified` in yellow (as of the current writing).
- Define a hash for each dependency in the repository. The package manager
  should verify that the hash corresponds to the actual tarball downloaded.
- Changes should be as minimal as possible. Commits must be self-explanatory.
  The first 80 characters of the commit should provide a brief description of
  the changes, followed by an empty line. Subsequent lines can contain a more
  in-depth explanation. Note that on GitHub, the first line of the commit will
  automatically be used as the title for a pull request, and the rest of the
  commit message will serve as the pull request description. Keeping the pull
  request description in the git history allows us to retain explanations even
  if the hosting platform goes offline.

- When updating a dependency, a careful analysis of the changes in the
  dependency must be conducted. The analysis consist of going through each
  release between the the two versions, and check that no critical changes have
  been discovered. If any, it must be fixed.
- Use a security advisory tool for the dependencies. In Rust, `cargo audit` can
  be used. It must not be made public or executed in a public CI as attackers
  would also be alerted (even if they could do the check automatically and
  periodically on their machine).
- When adding a new dependency, we must check the version we are using and
  determine if there have been any bugs in that version. Additionally, we must
  verify if the dependency is actively being developed.
- If git merge is used to backport changes from one branch to another, the pull
  request executing it should only contain the changes related to the git merge.
  If additional changes are needed to address conflicts, they should be in a
  separate commit. The reviewer must be able to reproduce the process.
- Integration tests help in detecting bugs when calling external dependencies
  and other related modules.
- There should be at least 2 reviewers per change.
- At least 2 individuals should have a good understanding of the code being modified.
- Reviewers should adopt an adversarial mindset, asking: "How can I break the
  code?" Reviews should not solely verify that the changes "make sense." As a
  reviewer, you should explain your review process, outline the scenarii you
  considered, and specify the exact elements you reviewed.

## Other related documents

- [The Rekt test](https://blog.trailofbits.com/2023/08/14/can-you-pass-the-rekt-test/)
