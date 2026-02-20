# MyCompany Monorepo

Shared repository containing multiple services and libraries.

## Repository Structure

- `packages/` - Shared libraries
  - `ui-components/` - React component library
  - `utils/` - Shared utilities
  - `types/` - TypeScript type definitions
- `services/` - Microservices
  - `api-gateway/` - API gateway service
  - `auth-service/` - Authentication service
  - `user-service/` - User management service
- `docs/` - Documentation
- `scripts/` - Build and deployment scripts

## Workspace Setup

This is a monorepo managed with pnpm workspaces.

```bash
# Install pnpm globally (if not installed)
npm install -g pnpm

# Install all dependencies
pnpm install

# Build all packages
pnpm run build

# Run tests across all packages
pnpm run test

# Run a specific service
pnpm --filter api-gateway dev
```

## Shared Conventions

### Commit Messages

Follow conventional commits:

- `feat(scope):` New feature
- `fix(scope):` Bug fix
- `docs(scope):` Documentation changes
- `chore(scope):` Maintenance tasks
- `refactor(scope):` Code refactoring

Example: `feat(auth-service): add OAuth2 provider support`

### Code Review

- All PRs require 2 approvals
- PR title must follow conventional commit format
- Link to related issue/ticket
- Include test coverage report

### Testing

- Unit tests required for all packages
- Integration tests for services
- E2E tests in `tests/e2e/`
- Minimum coverage: 80%

## Adding a New Package

1. Create directory in `packages/` or `services/`
2. Initialize with `pnpm init`
3. Add to root `pnpm-workspace.yaml` if needed
4. Follow the template in `docs/package-template.md`

## Release Process

We use changesets for versioning.

```bash
# Create a changeset
pnpm changeset

# Version packages
pnpm changeset version

# Publish to npm
pnpm changeset publish
```

## CI/CD

- GitHub Actions workflows in `.github/workflows/`
- All PRs must pass: lint, test, build
- Automatic deployment to staging on merge to `develop`
- Manual deployment to production from `main`
