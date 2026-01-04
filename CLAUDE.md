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

- Use conventional commit prefixes: `feat:`, `fix:`, `docs:`, `chore:`, `refactor:`, `test:`

## Ruby Version

Ruby version is specified in `.ruby-version` (currently 3.1.4).
