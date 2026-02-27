---
layout: post
title: Claude Code headless mode and automation
date: 2026-01-16 13:00:00 +0000
author: Danny Willems
tags: [claude, ai, tooling, automation, ci-cd]
---

Claude Code isn't just for interactive coding sessions. Its headless mode enables powerful automation workflows, from CI/CD pipelines to log analysis and code review bots. This article explores how to leverage Claude Code for automation.

## What is headless mode?

Headless mode allows you to use Claude Code in non-interactive environments like scripts, CI/CD pipelines, and automated workflows. Instead of starting a conversation, you can send a single query, get a response, and exit - perfect for automation.

The primary way to use headless mode is through the print mode flag (`-p` or `--print`), which sends a single prompt to Claude and prints the response to stdout.

## Print mode basics

The `-p` flag transforms Claude Code from an interactive assistant into a command-line tool you can integrate into any workflow.

**Basic syntax:**

```bash
claude -p "your prompt here"
```

See the example in `_examples/2026-01-16-claude-code-headless-automation/print-mode-basic.sh`:

```bash
#!/bin/bash
# Basic usage of print mode for a single query

claude -p "analyze the test coverage in this project"
```

**Specify a model:**

```bash
claude -p "review these changes and suggest improvements" --model claude-opus-4
```

The response is printed to stdout, making it easy to capture in scripts:

```bash
# Save the output
claude -p "explain this code" > explanation.txt

# Use in a pipeline
result=$(claude -p "suggest a fix for this error")
echo "$result"
```

## Piping support

One of the most powerful features of headless mode is its ability to accept input via stdin. This enables real-time analysis of logs, error messages, and other streaming data.

**Basic piping:**

From `_examples/2026-01-16-claude-code-headless-automation/piping-file.sh`:

```bash
#!/bin/bash
# Analyze a file using piping

cat error.txt | claude -p "explain this error and how to fix it"
```

**Analyze command output:**

From `_examples/2026-01-16-claude-code-headless-automation/piping-error-analysis.sh`:

```bash
#!/bin/bash
# Analyze error output from a command

npm test 2>&1 | claude -p "explain why these tests failed and suggest fixes"
```

**Real-time log analysis:**

From `_examples/2026-01-16-claude-code-headless-automation/piping-logs.sh`:

```bash
#!/bin/bash
# Analyze logs in real-time using piping

tail -f app.log | claude -p "analyze these logs for errors and suggest fixes"
```

This pattern is incredibly useful for:
- Debugging build failures in CI
- Analyzing production errors
- Monitoring application health
- Processing data streams

## CI/CD integration patterns

Claude Code integrates seamlessly into CI/CD pipelines. Here are common patterns and best practices.

### General patterns

**1. Automated code review**

Add Claude Code as a reviewer in your CI pipeline to catch issues before human review:

```bash
# Review changes in the current branch
git diff main..HEAD | claude -p "review these changes for potential issues"
```

**2. Test failure analysis**

When tests fail, automatically analyze the output:

```bash
npm test 2>&1 | claude -p "analyze these test failures and suggest root causes"
```

**3. Security scanning**

Analyze code changes for security vulnerabilities:

```bash
git diff --cached | claude -p "analyze for security vulnerabilities" \
  --allowed-tools view,grep
```

**4. Documentation generation**

Generate or update documentation based on code changes:

```bash
claude -p "update the API documentation based on recent changes"
```

### Best practices for CI/CD

**Use `--max-turns` to limit iterations:**

```bash
claude -p "review this PR" --max-turns 1
```

This prevents Claude from entering an interactive loop in automated environments.

**Restrict tool access with `--allowed-tools`:**

```bash
claude -p "analyze this code" --allowed-tools view,grep
```

This prevents unwanted side effects like file writes or command execution.

**Set environment variables:**

```bash
export ANTHROPIC_API_KEY="your-api-key"
claude -p "your prompt"
```

Store API keys as secrets in your CI platform.

**Handle timeouts and errors:**

```bash
timeout 5m claude -p "complex analysis" || echo "Analysis timed out"
```

Long-running analyses should have timeouts to prevent hanging builds.

## GitHub Actions integration

GitHub Actions is a natural fit for Claude Code automation. Here are two practical examples.

### Example 1: PR review bot

From `_examples/2026-01-16-claude-code-headless-automation/github-actions-pr-review.yml`:

```yaml
name: Claude Code PR Review

on:
  pull_request:
    types: [opened, synchronize]

jobs:
  claude-review:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Install Claude Code
        run: |
          curl -fsSL https://claude.ai/install.sh | bash
          echo "$HOME/.local/bin" >> $GITHUB_PATH

      - name: Review changes with Claude
        env:
          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
        run: |
          claude -p "review the changes in this PR and provide feedback" \
            --max-turns 1 > review.txt

      - name: Post review as comment
        uses: actions/github-script@v7
        with:
          script: |
            const fs = require('fs');
            const review = fs.readFileSync('review.txt', 'utf8');
            github.rest.issues.createComment({
              owner: context.repo.owner,
              repo: context.repo.repo,
              issue_number: context.issue.number,
              body: `## Claude Code Review\n\n${review}`
            });
```

This workflow:
1. Triggers on PR creation or updates
2. Installs Claude Code
3. Reviews the changes
4. Posts the review as a PR comment

### Example 2: Test failure analysis

From `_examples/2026-01-16-claude-code-headless-automation/github-actions-test-analysis.yml`:

```yaml
name: Test Failure Analysis

on:
  workflow_run:
    workflows: ["CI"]
    types: [completed]

jobs:
  analyze-failures:
    if: ${{ github.event.workflow_run.conclusion == 'failure' }}
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Install Claude Code
        run: |
          curl -fsSL https://claude.ai/install.sh | bash
          echo "$HOME/.local/bin" >> $GITHUB_PATH

      - name: Download test logs
        uses: actions/download-artifact@v4
        with:
          name: test-logs
          run-id: ${{ github.event.workflow_run.id }}

      - name: Analyze failures with Claude
        env:
          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
        run: |
          cat test-output.log | claude -p "analyze these test failures and suggest fixes" > analysis.txt

      - name: Create issue with analysis
        uses: actions/github-script@v7
        with:
          script: |
            const fs = require('fs');
            const analysis = fs.readFileSync('analysis.txt', 'utf8');
            github.rest.issues.create({
              owner: context.repo.owner,
              repo: context.repo.repo,
              title: 'Automated Test Failure Analysis',
              body: analysis,
              labels: ['automated-analysis', 'test-failure']
            });
```

This workflow:
1. Triggers when your CI workflow fails
2. Downloads test logs
3. Analyzes failures with Claude
4. Creates a GitHub issue with the analysis

**Setup requirements:**

Add your Anthropic API key to GitHub secrets:
1. Go to Settings → Secrets and variables → Actions
2. Add `ANTHROPIC_API_KEY` with your API key

## GitLab CI/CD integration

GitLab CI/CD works similarly to GitHub Actions. Here are two examples.

### Example 1: Merge request review

From `_examples/2026-01-16-claude-code-headless-automation/gitlab-ci-review.yml`:

```yaml
stages:
  - test
  - review

claude_review:
  stage: review
  image: ubuntu:latest
  before_script:
    - apt-get update && apt-get install -y curl
    - curl -fsSL https://claude.ai/install.sh | bash
    - export PATH="$HOME/.local/bin:$PATH"
  script:
    - |
      claude -p "review the changes in this merge request" \
        --max-turns 1 > review.txt
    - cat review.txt
  variables:
    ANTHROPIC_API_KEY: $ANTHROPIC_API_KEY
  only:
    - merge_requests
  artifacts:
    paths:
      - review.txt
    expire_in: 1 week
```

### Example 2: Security scanning

From `_examples/2026-01-16-claude-code-headless-automation/gitlab-ci-security.yml`:

```yaml
stages:
  - security
  - report

security_scan:
  stage: security
  image: ubuntu:latest
  before_script:
    - apt-get update && apt-get install -y curl git
    - curl -fsSL https://claude.ai/install.sh | bash
    - export PATH="$HOME/.local/bin:$PATH"
  script:
    - git diff $CI_MERGE_REQUEST_DIFF_BASE_SHA HEAD > changes.diff
    - |
      cat changes.diff | claude -p "analyze these changes for security vulnerabilities" \
        --allowed-tools view,grep > security-report.txt
    - cat security-report.txt
  variables:
    ANTHROPIC_API_KEY: $ANTHROPIC_API_KEY
  only:
    - merge_requests
  artifacts:
    reports:
      security: security-report.txt
    expire_in: 30 days
```

**Setup requirements:**

Add your API key to GitLab CI/CD variables:
1. Go to Settings → CI/CD → Variables
2. Add `ANTHROPIC_API_KEY` with your API key (marked as protected and masked)

## Scripting and automation best practices

### 1. Error handling

Always handle errors gracefully:

```bash
#!/bin/bash
set -e  # Exit on error

if ! claude -p "analyze this" > output.txt 2>&1; then
  echo "Claude analysis failed"
  cat output.txt
  exit 1
fi
```

### 2. Batch processing

From `_examples/2026-01-16-claude-code-headless-automation/batch-analysis.sh`:

```bash
#!/bin/bash
# Batch analyze multiple files

set -e

OUTPUT_DIR="claude-analysis"
mkdir -p "$OUTPUT_DIR"

# Analyze each file
for file in src/**/*.js; do
  echo "Analyzing $file..."
  filename=$(basename "$file")
  claude -p "analyze this file for code quality and suggest improvements" \
    --max-turns 1 < "$file" > "$OUTPUT_DIR/${filename}.review.txt"
done

echo "Analysis complete. Results in $OUTPUT_DIR/"
```

### 3. Pre-commit hooks

From `_examples/2026-01-16-claude-code-headless-automation/automation-script.sh`:

```bash
#!/bin/bash
# Automated code review script for pre-commit hook

set -e

# Get staged changes
git diff --cached > staged-changes.diff

# Ask Claude to review the changes
cat staged-changes.diff | claude -p "review these staged changes for potential issues" \
  --max-turns 1 \
  --allowed-tools view,grep > review.txt

# Display the review
cat review.txt

# Ask user if they want to proceed
echo ""
read -p "Proceed with commit? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
  echo "Commit cancelled"
  exit 1
fi
```

Install as a git hook:

```bash
cp automation-script.sh .git/hooks/pre-commit
chmod +x .git/hooks/pre-commit
```

### 4. Monitoring integration

From `_examples/2026-01-16-claude-code-headless-automation/monitoring-integration.sh`:

```bash
#!/bin/bash
# Monitor application logs and automatically analyze errors

LOG_FILE="/var/log/myapp/error.log"
ALERT_THRESHOLD=10

# Watch for errors
tail -f "$LOG_FILE" | while read line; do
  echo "$line" | grep -i "error" && {
    # Analyze the error with Claude
    echo "$line" | claude -p "analyze this error and suggest a fix" \
      --max-turns 1 > /tmp/error-analysis.txt
    
    # Send to monitoring system
    cat /tmp/error-analysis.txt | send-to-slack.sh
  }
done
```

### 5. Rate limiting and costs

Be mindful of API costs:

```bash
# Add delays between requests
for file in *.js; do
  claude -p "analyze $file" < "$file"
  sleep 2  # Wait 2 seconds between requests
done
```

## Session management for automation

While print mode is stateless by design (each invocation is independent), you can manage continuity through careful prompt design and state files.

### Stateless automation

Each `-p` invocation starts fresh with no memory of previous calls:

```bash
# These are completely independent
claude -p "what is this project about?"
claude -p "how do I build it?"  # Claude has no memory of the first question
```

This is usually what you want for automation - predictable, isolated operations.

### Maintaining context across calls

From `_examples/2026-01-16-claude-code-headless-automation/session-example.sh`:

```bash
#!/bin/bash
# Example of using session management for complex automation

# Start a session and save the session ID
SESSION_FILE="/tmp/claude-session-$$"

# First query - establish context
claude -p "I will send you multiple code review requests. Please be consistent in your feedback." \
  --max-turns 1 > "$SESSION_FILE"

# Subsequent queries can reference the same session context
for pr_number in $(get-open-prs); do
  echo "Reviewing PR #$pr_number"
  
  git fetch origin "pull/$pr_number/head:pr-$pr_number"
  git diff main..pr-$pr_number | \
    claude -p "review this PR following the same standards as before" \
    --max-turns 1 >> "$SESSION_FILE"
done

# Cleanup
rm -f "$SESSION_FILE"
```

**Note:** This doesn't create a true persistent session - each call is still independent. You're maintaining context by:
1. Including context in each prompt
2. Saving outputs for reference
3. Structuring prompts to be self-contained

For true session persistence, you'd need to use the interactive mode with tool automation (hooks), which is beyond the scope of headless automation.

### Prompt design for consistency

When automating, design prompts to be self-contained:

```bash
# Bad: Assumes context
claude -p "and what about error handling?"

# Good: Self-contained
claude -p "review error handling in the attached code changes" < changes.diff
```

## Common automation use cases

### 1. Code review automation

```bash
# Review all PRs awaiting review
for pr in $(gh pr list --json number -q '.[].number'); do
  gh pr diff "$pr" | \
    claude -p "review this PR for code quality, bugs, and best practices"
done
```

### 2. Documentation updates

```bash
# Generate changelog from commits
git log --oneline v1.0.0..HEAD | \
  claude -p "create a user-friendly changelog from these commits"
```

### 3. Performance analysis

```bash
# Analyze benchmark results
./run-benchmarks.sh | \
  claude -p "analyze these benchmark results and suggest optimizations"
```

### 4. Migration assistance

```bash
# Analyze code for migration issues
claude -p "identify issues when migrating from React 17 to React 18" \
  --allowed-tools view,grep
```

### 5. Testing

```bash
# Generate test cases
claude -p "generate comprehensive test cases for this API endpoint" < api.js
```

## Limitations and considerations

### API rate limits

Claude Code uses the Anthropic API, which has rate limits. For high-volume automation:
- Implement backoff strategies
- Cache results when possible
- Consider batching operations

### Non-interactive environment

In headless mode, Claude cannot:
- Ask for clarification
- Iterate based on tool results (with `--max-turns 1`)
- Use interactive features like file editing confirmations

Design prompts to be complete and unambiguous.

### Cost management

Each automation run consumes API credits. Monitor usage:
- Use `--max-turns` to limit iterations
- Restrict tools to only what's needed
- Consider running expensive analyses only on specific triggers (not every commit)

### Security

When running in CI/CD:
- Never commit API keys to version control
- Use secrets management (GitHub Secrets, GitLab Variables, etc.)
- Restrict Claude's tool access with `--allowed-tools`
- Review Claude's suggestions before applying them automatically

## Tips for effective automation

1. **Start simple**: Begin with basic print mode queries before building complex workflows

2. **Use specific prompts**: "Review for SQL injection vulnerabilities" beats "review this code"

3. **Combine with existing tools**: Claude augments, not replaces, your existing automation

4. **Test thoroughly**: Run automation in test environments before production

5. **Monitor and iterate**: Track what works and refine your prompts over time

6. **Document your automations**: Future you (and your team) will thank you

7. **Set clear expectations**: Claude is powerful but not infallible - always review outputs

## Resources

- [Claude Code Documentation](https://code.claude.com/docs/en/overview)
- [GitHub Action for Claude Code](https://github.com/anthropics/claude-code-action)
- [Anthropic API Documentation](https://docs.anthropic.com)
- [Best Practices Guide](https://www.anthropic.com/engineering/claude-code-best-practices)

## Related articles

- [Understanding Claude Code's /context command](/2026/01/16/claude-code-context-command.html)
- [Claude Code slash commands guide](/2026/01/16/claude-code-slash-commands.html)
- [Claude Code memory system](/2026/01/16/claude-code-memory-system.html)
- [Claude Code GitHub workflow integration](/2026/01/16/claude-code-github-workflow.html)

---

Headless mode transforms Claude Code from an interactive assistant into a powerful automation tool. Whether you're automating code reviews, analyzing logs, or integrating AI into your CI/CD pipeline, print mode and piping support make it possible. Start small, experiment with your workflows, and gradually build more sophisticated automations as you discover what works for your team.
