---
layout: post
title: Claude Code GitHub workflow integration
date: 2026-01-16 14:00:00 +0000
author: Danny Willems
tags: [claude, ai, github, git, tooling, productivity]
---

Claude Code integrates deeply with GitHub, enabling AI-assisted code review,
automated PR creation, and git workflow management. This article covers how to
set up and use these features effectively.

## Prerequisites

Install the `gh` CLI to enable Claude Code's GitHub functionality:

```bash
# macOS
brew install gh

# Then authenticate
gh auth login
```

## Local Git Operations

Claude Code handles git operations through natural language. Many engineers
report using Claude for 90%+ of their git interactions.

### Commit Messages

Simply ask Claude to commit your changes:

```
commit these changes
```

Claude examines your diff and recent commit history to compose contextually
appropriate messages. No need to think about wording.

### Creating Pull Requests

```
create a pr for this branch
```

Claude understands shorthand. It generates the PR title, description, and
summary based on the commits and context.

### Searching Git History

```
what changes made it into v1.2.3?
why was this API designed this way?
```

Claude can investigate past changes by examining version history. Explicitly
prompt it to look at git history when you need archaeological insights.

### Complex Operations

Claude handles operations that usually require looking up syntax:

- Reverting specific files to a previous state
- Resolving rebase conflicts
- Cherry-picking commits across branches
- Comparing and grafting patches

## GitHub Actions Integration

The real power comes from integrating Claude directly into your GitHub
workflows. Tag `@claude` in issues or PRs and Claude responds automatically.

### Quick Setup

The fastest way to set up GitHub Actions integration:

```bash
/install-github-app
```

This command (run in Claude Code terminal) guides you through installing the
GitHub app and adding required secrets. You must be a repository admin.

### Manual Setup

If the quickstart fails:

1. Install the Claude GitHub app: https://github.com/apps/claude
2. Add `ANTHROPIC_API_KEY` to your repository secrets
3. Create `.github/workflows/claude.yml`:

```yaml
name: Claude Code
on:
  issue_comment:
    types: [created]
  pull_request_review_comment:
    types: [created]

jobs:
  claude:
    runs-on: ubuntu-latest
    steps:
      - uses: anthropics/claude-code-action@v1
        with:
          anthropic_api_key: ${{ secrets.ANTHROPIC_API_KEY }}
```

### Using @claude Mentions

Once set up, tag `@claude` in any PR or issue comment:

```
@claude implement this feature based on the issue description
@claude how should I implement user authentication for this endpoint?
@claude fix the TypeError in the user dashboard component
@claude /review
```

Claude analyzes the context (code, diff, discussion) and responds appropriately.

### Available Commands

Pre-built prompts you can use:

- `@claude /review` - Perform code review
- `@claude /fix` - Fix identified bugs
- Custom requests in natural language

## Code Review Automation

Set up automatic code review on every PR:

```yaml
name: Code Review
on:
  pull_request:
    types: [opened, synchronize]

jobs:
  review:
    runs-on: ubuntu-latest
    steps:
      - uses: anthropics/claude-code-action@v1
        with:
          anthropic_api_key: ${{ secrets.ANTHROPIC_API_KEY }}
          prompt: "/review"
          claude_args: "--max-turns 5"
```

### Addressing Review Comments

When Claude or a human leaves review comments, you can ask Claude to address
them locally:

```
address the review comments on this PR
```

Claude reads the comments, makes the necessary changes, and can push them back.

## Action Configuration Options

Key parameters for `anthropics/claude-code-action@v1`:

| Parameter           | Description                                     |
| ------------------- | ----------------------------------------------- |
| `prompt`            | Instructions for Claude (text or slash command) |
| `claude_args`       | CLI arguments (--max-turns, --model, etc.)      |
| `anthropic_api_key` | Your API key (use secrets)                      |
| `trigger_phrase`    | Custom trigger (default: "@claude")             |
| `use_bedrock`       | Use AWS Bedrock instead of direct API           |
| `use_vertex`        | Use Google Vertex AI instead of direct API      |

### CLI Arguments

Pass additional options via `claude_args`:

```yaml
claude_args: |
  --max-turns 10
  --model claude-opus-4-5-20251101
  --allowed-tools Bash,Read,Write
```

## Best Practices

### 1. Create a CLAUDE.md File

Define coding standards and review criteria in your repository root:

```markdown
# Code Review Guidelines

- All new code must have tests
- Follow existing patterns in the codebase
- Use TypeScript strict mode
- No console.log in production code
```

Claude reads this file and follows your standards.

### 2. Security

- Always use GitHub Secrets for API keys
- Review Claude's suggestions before merging
- Limit action permissions to what's necessary
- Never hardcode API keys in workflows

### 3. Cost Management

GitHub Actions and API calls have costs:

- Use specific commands to reduce API calls
- Set reasonable `--max-turns` to prevent excessive iterations
- Configure workflow-level timeouts
- Control parallel runs with GitHub's concurrency settings

### 4. Permissions

Start with minimal permissions and expand as needed:

```yaml
permissions:
  contents: read
  pull-requests: write
```

Only grant `contents: write` if Claude needs to push commits.

## Example: Scheduled Reports

Generate daily summaries automatically:

```yaml
name: Daily Report
on:
  schedule:
    - cron: "0 9 * * *"

jobs:
  report:
    runs-on: ubuntu-latest
    steps:
      - uses: anthropics/claude-code-action@v1
        with:
          anthropic_api_key: ${{ secrets.ANTHROPIC_API_KEY }}
          prompt: "Generate a summary of yesterday's commits and open issues"
```

## Example: Security Review

Anthropic provides a dedicated security review action:

```yaml
- uses: anthropics/claude-code-security-review@v1
  with:
    anthropic_api_key: ${{ secrets.ANTHROPIC_API_KEY }}
```

This analyzes code changes specifically for security vulnerabilities.

## Troubleshooting

**Claude not responding to @claude**

- Verify the GitHub App is installed
- Check that workflows are enabled
- Ensure `ANTHROPIC_API_KEY` is in repository secrets

**CI not running on Claude's commits**

- Use the GitHub App (not Actions user) for proper permissions
- Verify workflow triggers include necessary events

**Authentication errors**

- Validate your API key
- For Bedrock/Vertex: verify credentials configuration
- Check secret names match workflow references

## Summary

Claude Code's GitHub integration eliminates the need to remember `gh` CLI syntax
while automating routine tasks. The key workflows:

1. **Local**: Commits, PRs, history search, complex git operations
2. **Remote**: @claude mentions for code review, fixes, and implementation
3. **Automated**: GitHub Actions for continuous review and reporting

Start with `/install-github-app` and iterate from there.

## Resources

- [Claude Code Action Repository](https://github.com/anthropics/claude-code-action)
- [Official Documentation](https://code.claude.com/docs/en/github-actions)
- [GitHub Marketplace](https://github.com/marketplace/actions/claude-code-action-official)
- [Security Review Action](https://github.com/anthropics/claude-code-security-review)
