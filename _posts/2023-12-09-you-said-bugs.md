---
layout: post
title: You said bugs? Key points I have learned over the years in FOSS development.
date: 2023-12-08 00:02:36 +0000
author: Danny Willems
tags: [bug, software, advices, prevention, FOSS, reviews]
---

I like this [post-mortem](https://github.com/ethereum-optimism/optimism/blob/master/technical-documents/postmortems/2022-02-02-inflation-vuln.md) from Optimism. Some key points I've learned over the years, and the post-mortem includes some.

- PRs must be very small.
- Commits must be small, specific to the PR. Commit messages must be clear
  about the changes. 
- When we update a dependency, we should carefully analyze what the dependency
  changes are.
- When we add a new dependency, we must check the version we use, and if there
  have been bugs in the versions. We must also check if it is actively
developped.
- When we switch an abstraction, we must be sure the abstraction does the same.
  Testing can always be our friend.
- End-to-end tests, i.e. scenarii, are very good tests as they include changes
  the in whole stack, including dependencies, not only at the library level.
- Integration tests help detecting bugs when calling external dependencies and
  other related modules. 
- At least 2 reviewers per changes.
- At least 2 persons should know well the code that is being modified.

Reviewers should be in an adversarial mindset, asking: how can I break the
code? Reviews should not be only verifying the changes "make sense". As a
reviewer, you should explain how you did the review, which scenarii you
did have in mind, what you did review exactly.

When there is a critical bug:
- first notify the big players of the software on a secure channel that there will be a hotfix.
- Ship publicly the fix in a unrelated PR, so-called "silent patching".

Please read the sections [Maximizing the effectiveness of our bug reporting
channels](https://github.com/ethereum-optimism/optimism/blob/master/technical-documents/postmortems/2022-02-02-inflation-vuln.md#maximizing-the-effectiveness-of-our-bug-reporting-channels)
and [Communicating with the
whitehat](https://github.com/ethereum-optimism/optimism/blob/master/technical-documents/postmortems/2022-02-02-inflation-vuln.md#communicating-with-the-whitehat).

I might edit this article with other contents.
