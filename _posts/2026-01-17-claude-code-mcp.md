---
layout: post
title: "Claude Code MCP: Model Context Protocol"
date: 2026-01-17 16:00:00 +0000
author: Danny Willems
tags: [claude, ai, mcp, tooling, productivity, integration]
---

Model Context Protocol (MCP) is one of Claude Code's most powerful features,
enabling it to connect to external data sources and services far beyond the
local filesystem. This article explains what MCP is, how to set it up, and how
to use it effectively without exhausting your context budget.

## What is MCP?

MCP (Model Context Protocol) is an open protocol that allows AI assistants like
Claude Code to access external tools, APIs, and data sources in a standardized
way. Think of it as a plugin system that extends Claude's capabilities beyond
reading and editing local files.

Without MCP, Claude is limited to:

- Reading files in your project
- Running local commands
- Accessing git history
- Using built-in tools

With MCP, Claude gains access to:

- Cloud storage (Google Drive, Dropbox)
- Design tools (Figma, Sketch)
- Communication platforms (Slack, Discord)
- Project management (Jira, Linear, Asana)
- Databases (PostgreSQL, MongoDB, Redis)
- Custom APIs and services you build

## How MCP Extends Claude Code

MCP servers run as separate processes that Claude communicates with using a
standardized protocol. Each server exposes:

**Tools**: Functions Claude can call (e.g., "search Slack messages", "query
database")

**Resources**: Data Claude can read (e.g., "Google Doc content", "Figma
designs")

**Prompts**: Pre-built templates for common operations

When you enable an MCP server, its tools become available to Claude alongside
built-in tools like `bash`, `view`, and `edit`. Claude decides when to use MCP
tools based on your requests.

**Example workflow:**

```
You: "Check our Figma designs for the login page colors"
Claude: [Uses Figma MCP server to fetch design]
Claude: "The login page uses #3B82F6 for primary buttons..."
```

## Setting Up MCP Servers

### Quick Setup

The fastest way to configure MCP:

```bash
/mcp
```

This opens an interactive guide to:

1. Browse available MCP servers
2. Install the ones you need
3. Configure authentication
4. Test the connection

### Manual Configuration

MCP servers are configured in `.claude/mcp.json` in your project root (or
`~/.claude/mcp.json` for global configuration).

**Basic example:**

See `_examples/2026-01-17-claude-code-mcp/basic-mcp.json`:

```json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_TOKEN": "${GITHUB_TOKEN}"
      }
    }
  }
}
```

**Configuration breakdown:**

- `command`: Executable to run (usually `npx` for Node.js servers)
- `args`: Arguments passed to the command
- `env`: Environment variables (use `${VAR}` for system variables)

### Environment Variables

Never hardcode credentials in `mcp.json`. Use environment variables:

**In your shell config (`.bashrc`, `.zshrc`):**

```bash
export GITHUB_TOKEN="ghp_your_token_here"
export SLACK_BOT_TOKEN="xoxb-your-token"
export GDRIVE_CLIENT_ID="your-client-id"
```

**Or use a `.env` file:**

```bash
# .env (add to .gitignore!)
GITHUB_TOKEN=ghp_your_token_here
SLACK_BOT_TOKEN=xoxb-your-token
```

## Common MCP Integrations

### Google Drive

Access design documents, specifications, and shared files.

```json
{
  "google-drive": {
    "command": "npx",
    "args": ["-y", "@modelcontextprotocol/server-gdrive"],
    "env": {
      "GDRIVE_CLIENT_ID": "${GDRIVE_CLIENT_ID}",
      "GDRIVE_CLIENT_SECRET": "${GDRIVE_CLIENT_SECRET}",
      "GDRIVE_REFRESH_TOKEN": "${GDRIVE_REFRESH_TOKEN}"
    }
  }
}
```

**Use cases:**

```
read the PRD from the shared drive
summarize the engineering spec in Google Docs
what does the design document say about authentication?
```

### Figma

View and discuss designs directly from Claude.

```json
{
  "figma": {
    "command": "npx",
    "args": ["-y", "@modelcontextprotocol/server-figma"],
    "env": {
      "FIGMA_ACCESS_TOKEN": "${FIGMA_ACCESS_TOKEN}"
    }
  }
}
```

**Use cases:**

```
what colors are used in the dashboard design?
check the spacing in the mobile layout
are the button styles consistent across screens?
```

### Slack

Search messages, read channels, and access team knowledge.

```json
{
  "slack": {
    "command": "npx",
    "args": ["-y", "@modelcontextprotocol/server-slack"],
    "env": {
      "SLACK_BOT_TOKEN": "${SLACK_BOT_TOKEN}",
      "SLACK_TEAM_ID": "${SLACK_TEAM_ID}"
    }
  }
}
```

**Use cases:**

```
what did the team decide about the API design?
search for discussions about authentication
check #engineering for deployment updates
```

### Jira

Access issues, epics, and project tracking data.

```json
{
  "jira": {
    "command": "npx",
    "args": ["-y", "@modelcontextprotocol/server-jira"],
    "env": {
      "JIRA_URL": "${JIRA_URL}",
      "JIRA_EMAIL": "${JIRA_EMAIL}",
      "JIRA_API_TOKEN": "${JIRA_API_TOKEN}"
    }
  }
}
```

**Use cases:**

```
show me the acceptance criteria for PROJ-123
what's blocking the current sprint?
list all open bugs assigned to me
```

### Database Access

Query databases directly (use with caution in production).

```json
{
  "postgres": {
    "command": "npx",
    "args": ["-y", "@modelcontextprotocol/server-postgres"],
    "env": {
      "POSTGRES_URL": "${POSTGRES_URL}"
    }
  }
}
```

**Use cases:**

```
how many users signed up last week?
show me the schema for the orders table
what's the average order value?
```

**Full example configuration:**

See `_examples/2026-01-17-claude-code-mcp/full-mcp.json` for a complete setup
with multiple integrations.

## Custom MCP Server Development

You can build custom MCP servers for proprietary tools, internal APIs, or
unique workflows.

### Basic Server Structure

MCP servers use the `@modelcontextprotocol/sdk` package. Here's a minimal
example:

See `_examples/2026-01-17-claude-code-mcp/custom-server.js` for a complete
custom server implementation.

**Key components:**

1. **Server initialization**: Set name and capabilities
2. **Tool definitions**: Declare tools with schemas
3. **Request handlers**: Implement tool logic
4. **Transport**: Use stdio for communication

### Installing Your Custom Server

1. **Create package.json:**

See `_examples/2026-01-17-claude-code-mcp/package.json`.

2. **Install dependencies:**

```bash
npm install
```

3. **Configure in mcp.json:**

See `_examples/2026-01-17-claude-code-mcp/custom-server-config.json`.

4. **Test it:**

```bash
claude
# Then try: "what's the weather in San Francisco?"
```

### Development Tips

**Start simple**: Begin with one tool and expand gradually.

**Use TypeScript**: Better type safety and IDE support.

**Handle errors**: Return clear error messages.

**Test independently**: Test your server before integrating with Claude.

**Document tools**: Clear descriptions help Claude use them effectively.

## Context Consumption and Impact

MCP servers can consume significant context tokens. This is the most important
consideration when using MCP.

### How MCP Uses Context

When you enable an MCP server, Claude loads:

- Tool definitions (name, description, parameters)
- Available resources
- Prompt templates

This happens at session start and remains in context throughout the
conversation.

### Measuring Impact

Use `/context` to see MCP usage:

```
⛁ MCP tools:      82.0k tokens (41.0%)
```

In this example, MCP servers consume 41% of available context. This is
significant.

**Typical consumption:**

- **Simple server** (1-2 tools): 5-10k tokens (2-5%)
- **Medium integration** (5-10 tools): 20-40k tokens (10-20%)
- **Complex setup** (multiple servers): 80k+ tokens (40%+)

### Context Exhaustion

If MCP servers consume too much context:

- Less room for conversation history
- Faster context compaction (losing earlier messages)
- Reduced file viewing capability
- Overall degraded performance

**Warning signs:**

- `/context` shows <20% free space
- Claude frequently "forgets" earlier discussions
- Complex tasks become difficult to complete

### Optimization Strategies

**1. Enable only what you need:**

```bash
# Before session
/mcp
# Disable unused servers
```

**2. Use project-specific configs:**

```
project-a/.claude/mcp.json  # Only GitHub
project-b/.claude/mcp.json  # GitHub + Figma
```

**3. Disable between sessions:**

If you don't use MCP constantly, keep it disabled and enable on-demand.

**4. Choose lightweight servers:**

Some servers are more efficient than others. Check context usage after adding
each server.

**5. Build minimal custom servers:**

When building custom servers, minimize tool descriptions and parameters.

## Best Practices for MCP Configuration

### Security

**Never commit credentials:**

```bash
# .gitignore
.env
.claude/mcp.local.json
```

**Use readonly tokens when possible:**

Many services offer readonly API tokens. Use them for Claude to prevent
accidental modifications.

**Audit server code:**

Before using third-party MCP servers, review their code or use only official
implementations.

**Limit database access:**

Use read-only database users for MCP servers. Never use admin credentials.

### Performance

**Start sessions with specific intent:**

If you know you'll need Slack, enable it at the start rather than mid-session.

**Separate MCP-heavy and MCP-light work:**

Use different sessions for tasks that need external data vs. pure coding tasks.

**Monitor and adjust:**

Regularly check `/context` and disable underutilized servers.

### Team Collaboration

**Document required servers:**

Add to `CLAUDE.md`:

```markdown
## MCP Configuration

This project uses:

- GitHub MCP (required for PR workflow)
- Figma MCP (required for design implementation)

See `.claude/mcp.json.example` for configuration.
```

**Provide example configs:**

Commit `.claude/mcp.json.example` with placeholder credentials:

```json
{
  "mcpServers": {
    "github": {
      "env": {
        "GITHUB_TOKEN": "REPLACE_WITH_YOUR_TOKEN"
      }
    }
  }
}
```

**Share setup guides:**

Document how to obtain API tokens for each required service.

### Debugging

**Test server independently:**

```bash
node custom-server.js
# Should output: "Custom MCP server running on stdio"
```

**Check Claude logs:**

```bash
claude --debug
```

Look for MCP-related errors in the output.

**Verify environment variables:**

```bash
echo $GITHUB_TOKEN
# Should output your token
```

**Start with minimal config:**

If MCP isn't working, strip down to one server and test.

## MCP Registry

The official MCP registry lists community-built servers:

- https://github.com/modelcontextprotocol/servers

**Available servers include:**

- AWS (EC2, S3, CloudWatch)
- Brave Search
- Browserbase (web automation)
- Cloudflare (D1, KV, R2)
- Docker
- Filesystem (advanced file operations)
- Git
- Google Maps
- Memory (persistent storage)
- Playwright (browser testing)
- Puppeteer
- Sentry
- Sequential Thinking (reasoning enhancement)
- Time (scheduling, timezone)
- And many more...

**Installing from registry:**

Most servers use `npx` for zero-install:

```json
{
  "brave-search": {
    "command": "npx",
    "args": ["-y", "@modelcontextprotocol/server-brave-search"],
    "env": {
      "BRAVE_API_KEY": "${BRAVE_API_KEY}"
    }
  }
}
```

## When to Use MCP

**Good use cases:**

- Accessing design specs during implementation
- Querying project management tools for context
- Reading shared documentation from cloud storage
- Investigating production issues via database queries
- Integrating proprietary internal tools

**When to avoid:**

- Simple coding tasks that don't need external data
- When context budget is already tight
- For data that could be provided directly in conversation
- When security/privacy is a concern

**Alternative approaches:**

Instead of MCP, consider:

- Copy-pasting relevant content into conversation
- Downloading files locally
- Using API calls from within code
- Traditional CLI tools

MCP is powerful but has trade-offs. Use it when external data access
significantly improves Claude's effectiveness.

## Summary

Model Context Protocol extends Claude Code far beyond the local filesystem,
enabling access to:

- Cloud storage and documentation
- Design tools and specifications
- Communication platforms
- Databases and APIs
- Custom internal tools

**Key takeaways:**

1. **Start small**: Enable one server at a time
2. **Monitor context**: Use `/context` to track usage
3. **Secure credentials**: Never commit tokens, use environment variables
4. **Optimize for need**: Only enable servers you're actively using
5. **Build custom**: Extend Claude with your own integrations

MCP transforms Claude from a local coding assistant into a team member with
access to your entire development ecosystem. Used wisely, it's incredibly
powerful. Used carelessly, it exhausts context and degrades performance.

The key is balance: enable what you need, disable what you don't, and monitor
impact continuously.

## Resources

- [Model Context Protocol Specification](https://modelcontextprotocol.io)
- [MCP Server Registry](https://github.com/modelcontextprotocol/servers)
- [MCP SDK Documentation](https://github.com/modelcontextprotocol/sdk)
- [Claude Code Documentation](https://code.claude.com/docs/en/overview)
- [Claude Code Slash Commands](/2026/01/16/claude-code-slash-commands.html) -
  Includes `/mcp` command details
- [Claude Code Context Management](/2026/01/16/claude-code-context-command.html) -
  Understanding context usage
- [Claude Code Cheat Sheet](/tools/claude-code-cheatsheet/) - Quick MCP
  reference
