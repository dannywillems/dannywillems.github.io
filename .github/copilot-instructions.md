# Copilot Instructions for dannywillems.github.io

This document provides guidance for GitHub Copilot when working on issues in this
repository.

## Repository Overview

This is a Jekyll-based personal website hosted on GitHub Pages. It contains:
- Blog posts in `_posts/` directory
- Static pages in root and subdirectories
- Layouts in `_layouts/`
- Includes in `_includes/`
- Assets in `assets/`

## Writing Articles

### Article Location
All blog posts go in `_posts/` with the naming convention:
```
YYYY-MM-DD-slug-name.md
```

### Article Format
```markdown
---
layout: post
title: Article Title Here
date: YYYY-MM-DD HH:MM:SS +0000
author: Danny Willems
tags: [tag1, tag2, tag3]
---

Article content in markdown...
```

### Writing Style
- Use clear, technical language
- Include code examples where appropriate
- Use proper markdown formatting (headers, code blocks, lists)
- Keep paragraphs concise
- Add links to external resources and documentation
- NO emojis unless explicitly requested

### Code Examples

**IMPORTANT**: All code examples MUST be in separate files, not inline in the article.
This allows us to run linters, formatters, and compilers on the code.

1. **Create code files** in a directory matching the article:
   ```
   _examples/YYYY-MM-DD-article-slug/
   ├── example1.sh
   ├── config.yaml
   └── script.js
   ```

2. **Include in the article** using Jekyll's include or by referencing the file:
   ```markdown
   See the example in `_examples/2026-01-16-article-slug/example1.sh`:

   \`\`\`bash
   {% raw %}{% include_relative ../_examples/2026-01-16-article-slug/example1.sh %}{% endraw %}
   \`\`\`
   ```

   Or for simple cases, copy the content but always keep the source file:
   ```markdown
   \`\`\`bash
   # From _examples/2026-01-16-article-slug/example1.sh
   command here
   \`\`\`
   ```

3. **File requirements**:
   - All code must be syntactically valid and runnable
   - Use appropriate file extensions (.sh, .js, .yaml, .json, etc.)
   - Include shebang for shell scripts (#!/bin/bash)
   - Code will be checked by linters and formatters

## Claude Code Articles Specifically

When writing articles about Claude Code features:

1. **Research first** - Check official documentation at:
   - https://code.claude.com/docs/en/overview
   - https://github.com/anthropics/claude-code
   - https://www.anthropic.com/engineering/claude-code-best-practices

2. **Structure**:
   - Introduction (what is this feature, why it matters)
   - How to use it (with examples)
   - Configuration options
   - Best practices
   - Resources section at the end

3. **Update the cheat sheet** at `tools/claude-code-cheatsheet.md`:
   - Add relevant commands/config to appropriate sections
   - Link to the new article

## Git Workflow

- Create branches named descriptively: `dw/article-topic-name`
- Commit messages should use conventional prefixes:
  - `docs:` for documentation/articles
  - `feat:` for new features
  - `fix:` for bug fixes
  - `chore:` for maintenance
- Do NOT include Claude/Copilot as co-author
- Do NOT add "Generated with" lines
- Target `develop` branch for PRs (never push directly to master)

## PR Format

```markdown
## Summary
- Brief description of changes

## Related
Closes #XXX
Part of #96 (if related to Claude Code articles)
Part of #112 (if related to Claude Code article series)

## Test plan
- [ ] Article renders correctly
- [ ] Links work
- [ ] Code examples are properly formatted
```
