---
title: "Claude Code Memory System: CLAUDE.md Files Explained"
author: Danny Willems
date: 2026-01-16 00:00:00 +0000
layout: post
tags: [claude-code, ai, memory, productivity, documentation]
---

One of Claude Code's most powerful features is its memory system, built around
`CLAUDE.md` files. These files act as persistent context that helps Claude
understand your project's conventions, build commands, and workflows without
you having to repeat yourself in every conversation.

Think of `CLAUDE.md` as a README specifically for AI assistants—a way to encode
the knowledge an experienced developer would have about your codebase.

## What is CLAUDE.md?

`CLAUDE.md` is a markdown file placed in your repository that provides context
to Claude Code about your project. Unlike conversation messages that get
compacted as your session grows, memory files are always loaded at the start of
every conversation.

When you start a Claude Code session, it automatically searches for `CLAUDE.md`
files in:

1. The current working directory
2. Parent directories up to the repository root
3. The repository root itself

This hierarchical approach means you can have both project-wide and
directory-specific context.

## Why Memory Files Matter

Without a memory file, you might find yourself repeatedly explaining:

- How to build and test the project
- Code style conventions
- Project structure
- Common workflows and tasks
- Environment setup requirements

With `CLAUDE.md`, this context is automatically loaded. Claude can:

- Run the correct build commands without asking
- Follow your team's coding conventions
- Navigate your project structure efficiently
- Understand your git workflow
- Know which tools and frameworks you use

## What to Include in CLAUDE.md

### Essential Information

At minimum, your `CLAUDE.md` should include:

**Build Commands**: How to install dependencies, build, and test

```markdown
## Development

\`\`\`bash
npm install # Install dependencies
npm run dev # Start development server
npm test # Run tests
\`\`\`
```

**Project Structure**: Key directories and their purpose

```markdown
## Project Structure

- `src/` - Source code
- `tests/` - Test files
- `docs/` - Documentation
- `scripts/` - Build scripts
```

**Code Conventions**: Style guides and patterns to follow

```markdown
## Conventions

- Use TypeScript for all new code
- Follow ESLint configuration
- Prefer functional components with hooks
- Write tests for all new features
```

### Advanced Configuration

For larger projects, consider including:

**Git Workflow**: Branching strategy and commit conventions

```markdown
## Git Workflow

- `main` - Production branch, protected
- `develop` - Development branch
- Feature branches: `feature/description`
- Always create PR to `develop`
```

**Common Tasks**: Step-by-step guides for frequent operations

```markdown
## Adding a New API Endpoint

1. Create view in `api/views/`
2. Add URL pattern in `api/urls.py`
3. Write tests in `api/tests/`
4. Update API documentation
```

**Environment Configuration**: Required variables and setup

```markdown
## Environment Variables

Copy `.env.example` to `.env` and configure:

- `DATABASE_URL` - PostgreSQL connection
- `API_KEY` - External API key
```

## Hierarchical Memory Files

Claude Code's hierarchical memory system is particularly useful for monorepos
and large projects with distinct subsections.

### Example: Monorepo Structure

```
my-monorepo/
├── CLAUDE.md                    # Repository-wide context
├── packages/
│   └── ui-components/
│       └── CLAUDE.md            # Package-specific context
└── services/
    └── api-gateway/
        └── CLAUDE.md            # Service-specific context
```

**Root CLAUDE.md** (repository-wide context):

```markdown
# MyCompany Monorepo

Shared repository containing multiple services and libraries.

## Workspace Setup

pnpm install      # Install all dependencies
pnpm run build    # Build all packages
pnpm run test     # Run tests across all packages
pnpm --filter api-gateway dev  # Run specific service

## Shared Conventions

- Follow conventional commits: feat(scope):, fix(scope):
- All PRs require 2 approvals
- Minimum test coverage: 80%

See full example in:
`_examples/2026-01-16-claude-code-memory-system/monorepo-root-CLAUDE.md`
```

**Service-specific CLAUDE.md** (adds service-level details):

```markdown
# API Gateway Service

Part of MyCompany monorepo. See root CLAUDE.md for general conventions.

## Local Development

docker-compose up -d redis  # Start dependencies
pnpm dev                    # Start with hot reload
pnpm test:coverage          # Run tests with coverage

## Service-Specific Conventions

- Use Winston logger from src/utils/logger.ts
- All endpoints include rate limiting
- Mock external service calls in tests

See full example in:
`_examples/2026-01-16-claude-code-memory-system/subdirectory-CLAUDE.md`
```

When working in `services/api-gateway/`, Claude loads both the root and
service-specific memory files, giving it complete context.

## Memory Files and Context Usage

Memory files consume context tokens from your conversation budget. Understanding
this helps you optimize their content.

### Context Allocation

Claude Code's context window is divided into categories. Use `/context` to see
the breakdown:

- **System prompt**: Claude's base instructions
- **System tools**: Built-in tool definitions
- **Custom agents**: Your `.claude/agents/` definitions
- **Memory files**: Your `CLAUDE.md` files
- **MCP tools**: Model Context Protocol servers
- **Reserved**: Buffer for auto-compaction (~40-45k tokens)
- **Messages**: Conversation history
- **Free space**: Available for new content

Memory files are loaded once at session start and remain throughout the
conversation. They don't grow like message history, making them efficient for
persistent context.

### Optimization Tips

**Be Concise**: Write clearly but avoid redundancy. Instead of:

```markdown
To run tests, execute the command `npm test`. This will run all tests in the
test suite. You can also run specific tests by passing a pattern.
```

Write:

```markdown
## Testing

\`\`\`bash
npm test # Run all tests
npm test pattern # Run specific tests
\`\`\`
```

**Use Code Blocks**: Command examples are clearer and more compact in code
blocks.

**Link to External Docs**: For detailed documentation, link rather than
duplicate:

```markdown
## Architecture

See [Architecture Guide](docs/architecture.md) for detailed design decisions.
```

**Keep Examples Minimal**: Show the pattern, not every variation:

```markdown
## Error Handling

\`\`\`typescript
throw new ApiError(StatusCodes.BAD_REQUEST, "Invalid input");
\`\`\`

All error types are in `src/errors/`.
```

## Examples of Effective CLAUDE.md Files

### Basic Project

For a simple web application:

```markdown
# Project Overview

Simple web application built with Express.js and PostgreSQL.

## Development

npm install      # Install dependencies
npm run dev      # Start development server (port 3000)
npm run build    # Build for production
npm test         # Run tests

## Code Conventions

- Use TypeScript for all new code
- Follow ESLint configuration (run npm run lint)
- Write tests for all new features
- Use async/await instead of callbacks
```

See full example in:
`_examples/2026-01-16-claude-code-memory-system/basic-project-CLAUDE.md`

### Comprehensive Configuration

For a larger full-stack application with multiple build environments:

```markdown
# MyApp Project

Full-stack application with React frontend and Django backend.

## Build Commands

# Backend (Django)
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver

# Frontend (React)
cd frontend
npm install
npm start

## Code Conventions

### Python (Backend)
- Follow PEP 8 style guide
- Use type hints for all function signatures
- Run black . and flake8 before committing

### JavaScript/TypeScript (Frontend)
- Use TypeScript for all new code
- Prefer functional components with hooks
- File naming: PascalCase for components, camelCase for utilities
```

See full example in:
`_examples/2026-01-16-claude-code-memory-system/comprehensive-CLAUDE.md`

This example shows how to document:

- Multiple build environments (backend/frontend)
- Code conventions for different languages
- Project structure
- Git workflow
- Common tasks with step-by-step instructions

## Best Practices

### Start Small, Iterate

Begin with basics:

1. Build commands
2. Project structure
3. Key conventions

Add more context as patterns emerge from your conversations with Claude.

### Update After Major Changes

When you:

- Change build tools
- Adopt new conventions
- Restructure the project
- Add new workflows

Update your `CLAUDE.md` to reflect the current state.

### Use Multiple Files for Monorepos

In monorepos:

- Root `CLAUDE.md`: Shared conventions, workspace setup
- Package `CLAUDE.md`: Package-specific build, test, conventions
- Service `CLAUDE.md`: Service architecture, dependencies, configuration

This keeps each file focused and relevant to its scope.

### Include What You Repeat

If you find yourself explaining the same thing in multiple conversations, add it
to `CLAUDE.md`:

- "We use Jest, not Mocha"
- "Always run the linter before committing"
- "Database migrations go in migrations/"
- "Never commit API keys"

### Document Common Issues

Include workarounds for known issues:

```markdown
## Common Issues

### Port Already in Use

\`\`\`bash
lsof -ti:3000 | xargs kill -9
\`\`\`

### Redis Connection Failed

Ensure Docker is running: `docker-compose up -d redis`
```

### Keep Security in Mind

**Never include** in `CLAUDE.md`:

- API keys, passwords, or tokens
- Private URLs or endpoints
- Customer data or PII
- Proprietary algorithms (unless in private repo)

Do include:

- Which environment variables are needed
- How to obtain credentials (link to internal docs)
- Security practices to follow

## Monitoring Memory Impact

Use `/context` regularly to check memory file usage:

```
Memory files: 4,231 tokens (2.1%)
```

If memory files consume more than 5-10% of your context:

- Review for redundancy
- Move detailed docs to external files
- Split overly long files
- Link to documentation instead of embedding it

## Working Without Memory Files

You don't need `CLAUDE.md` to use Claude Code. It works fine without it. But as
your project grows and conversations become repetitive, memory files become
increasingly valuable.

Start adding `CLAUDE.md` when:

- You're onboarding team members
- You find yourself repeating project context
- Build commands are non-standard
- Your team has specific conventions

## Integration with Other Tools

`CLAUDE.md` complements other documentation:

- **README.md**: For humans, getting-started guide
- **CLAUDE.md**: For AI, operational context
- **CONTRIBUTING.md**: For contributors, guidelines
- **docs/**: Detailed design docs and architecture

There's overlap, and that's fine. `CLAUDE.md` is optimized for Claude's needs,
while other docs serve different audiences.

## Memory Files vs. Conversation Context

Understanding the difference:

**Memory Files** (`CLAUDE.md`):

- Loaded at session start
- Persistent across conversations
- Good for: conventions, build commands, project structure
- Token cost: Fixed, doesn't grow

**Conversation Context**:

- Grows with each message
- Specific to current session
- Good for: current task details, specific code discussions
- Token cost: Accumulates, eventually compacted

Use memory files for knowledge that applies across tasks. Use conversation
messages for task-specific details.

## Resources

- [Claude Code Cheat Sheet](/tools/claude-code-cheatsheet/) - Quick reference
  for commands and features
- [Understanding the /context Command](/2026/01/16/claude-code-context-command.html) -
  Deep dive into context management
- Official Documentation - https://code.claude.com/docs/en/memory (when
  available)

## Conclusion

`CLAUDE.md` files transform Claude Code from a conversational assistant into a
knowledgeable team member who understands your project's specifics. By encoding
build commands, conventions, and workflows, you reduce repetition and improve
the quality of Claude's assistance.

Start with a simple `CLAUDE.md` containing build commands and a few key
conventions. As you use Claude Code, you'll discover what context is most
valuable and expand your memory files accordingly.

The goal isn't to document everything—it's to capture the knowledge that makes
collaboration more efficient and helps Claude provide better, more contextually
aware assistance.
