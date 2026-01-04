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

- Always create pull requests against `develop`, not `master`
- Use conventional commit prefixes: `feat:`, `fix:`, `docs:`, `chore:`, `refactor:`, `test:`

## Ruby Version

Ruby version is specified in `.ruby-version` (currently 3.1.4).
