# Claude Code Guidelines

## Project Overview

Jekyll-based personal website hosted on GitHub Pages.

## Development

```bash
make install-rvm    # Install rvm (first time setup)
make install-ruby   # Install Ruby via rvm
make install        # Install dependencies
make serve          # Run local server
make build          # Build the site
```

## Git Workflow

### Branching Strategy

- `master`: Production branch, protected. No direct pushes allowed.
- `develop`: Development branch. All PRs should target this branch.
- Never push directly to `master` or `develop`. Always create a feature branch and submit a PR.
- Feature branches should be named descriptively (e.g., `fix/dark-mode-seed-display`, `feat/qr-codes`)

### Commit Standards

- No emojis in commit messages
- Do not add Claude as co-author
- Wrap commit message titles at 72 characters
- Wrap commit message body at 80 characters
- Use conventional commit prefixes: `feat:`, `fix:`, `docs:`, `chore:`, `refactor:`, `test:`

## Ruby Version

Ruby version is specified in `.ruby-version` (currently 3.3.10).
