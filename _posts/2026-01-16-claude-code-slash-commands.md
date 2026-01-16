---
layout: post
title: "Claude Code Slash Commands: A Comprehensive Guide"
date: 2026-01-16 12:00:00 +0000
author: Danny Willems
tags: [claude-code, ai, productivity, tools]
---

Claude Code provides a powerful set of slash commands that enhance your coding workflow. These commands allow you to configure the environment, manage tools, set up automation, and more. This article provides a comprehensive overview of all available slash commands.

## What are Slash Commands?

Slash commands are special commands that start with `/` and provide access to Claude Code's configuration and utility features. They can be invoked at any time during your conversation with Claude by simply typing the command.

## Available Commands

### `/help` - Display Available Commands

The `/help` command shows you all available slash commands and their descriptions. This is your starting point when you want to discover what Claude Code can do.

**Usage:**
```
/help
```

**What it shows:**
- Complete list of all slash commands
- Brief description of each command
- Usage examples for complex commands

**When to use it:**
- When you're new to Claude Code
- To discover new features
- As a quick reference for command syntax

### `/config` - Interactive Settings Configuration

The `/config` command launches an interactive configuration interface where you can adjust Claude Code's behavior and preferences.

**Usage:**
```
/config
```

**What you can configure:**
- Model selection (Claude 3.5 Sonnet, etc.)
- Token limits and context management
- Tool permissions and restrictions
- Default behaviors and preferences
- Output formatting options

**Configuration hierarchy:**

Claude Code uses a three-tier configuration system:

1. **User settings** (`~/.claude/settings.json`) - Global settings for all projects
2. **Project settings** (`.claude/settings.json`) - Team-wide settings (git tracked)
3. **Local settings** (`.claude/settings.local.json`) - Personal overrides (git ignored)

Settings are merged in this order, with local settings taking precedence.

**Example configuration options:**
- `model`: Which Claude model to use
- `maxTokens`: Maximum tokens per response
- `temperature`: Creativity/randomness level (0.0-1.0)
- `autoApproveTools`: Which tools can run without confirmation

See the example configuration file:

```json
{
  "model": "claude-3-5-sonnet-20241022",
  "maxTokens": 8192,
  "temperature": 0.7,
  "autoApproveTools": ["read", "grep", "view"],
  "hooks": {
    "enabled": true
  }
}
```

### `/allowed-tools` - Manage Tool Permissions

The `/allowed-tools` command lets you control which tools Claude can use during your session. This is useful for security, limiting actions, or focusing on specific tasks.

**Usage:**
```
/allowed-tools
```

**What it does:**
- Shows currently enabled/disabled tools
- Allows you to enable or disable specific tools
- Can restrict tools for the current session only

**Common tools you might want to control:**
- `bash` - Execute shell commands
- `edit` - Modify files
- `create` - Create new files
- `web_fetch` - Access external URLs
- `gh-advisory-database` - Check dependencies for vulnerabilities

**Example use cases:**

**Read-only mode:** When you want Claude to analyze code without making changes:
```
Enable: view, grep, glob, read_bash
Disable: edit, create, bash (write mode)
```

**Safe exploration:** When exploring a new codebase:
```
Enable: view, grep, glob, search tools
Disable: edit, create, bash
```

**Full automation:** When you trust Claude to make changes:
```
Enable: all tools
```

### `/hooks` - Set Up Automation Triggers

Hooks allow you to automate actions at specific points in your Claude Code workflow. They can run commands, format code, run linters, or integrate with external tools.

**Usage:**
```
/hooks
```

**Available hook types:**

1. **PreToolUse** - Runs before a tool is executed
2. **PostToolUse** - Runs after a tool completes
3. **UserPromptSubmit** - Runs when you send a message
4. **SessionStart** - Runs when a new session begins

**Configuration:**

Hooks are defined in your `.claude/settings.json`:

```json
{
  "hooks": {
    "enabled": true,
    "PostToolUse": {
      "edit": "npm run format ${file}"
    }
  }
}
```

**Common use cases:**

**Auto-format after editing:**
```json
{
  "hooks": {
    "PostToolUse": {
      "edit": "prettier --write ${file}"
    }
  }
}
```

**Run tests after changes:**
```json
{
  "hooks": {
    "PostToolUse": {
      "edit": "npm test -- --findRelatedTests ${file}"
    }
  }
}
```

**Lint on save:**
```json
{
  "hooks": {
    "PostToolUse": {
      "edit": "eslint --fix ${file}"
    }
  }
}
```

**Session setup:**
```json
{
  "hooks": {
    "SessionStart": "git fetch origin && echo 'Ready to code!'"
  }
}
```

### `/mcp` - Configure MCP Servers

Model Context Protocol (MCP) allows Claude Code to connect to external data sources and tools. This extends Claude's capabilities beyond the local filesystem.

**Usage:**
```
/mcp
```

**What is MCP?**

MCP is a protocol that allows Claude to:
- Access external APIs and services
- Read from databases
- Integrate with third-party tools
- Fetch context from cloud services

**Common MCP integrations:**
- **Google Drive** - Access design docs and specifications
- **Figma** - View and discuss designs
- **Slack** - Search conversations and channels
- **Jira** - Read issues and project data
- **GitHub** - Extended GitHub API access
- **Database connectors** - Query PostgreSQL, MongoDB, etc.

**Configuration:**

MCP servers are configured in `.claude/mcp.json`:

```json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_TOKEN": "${GITHUB_TOKEN}"
      }
    },
    "google-drive": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-gdrive"],
      "env": {
        "GDRIVE_CLIENT_ID": "${GDRIVE_CLIENT_ID}",
        "GDRIVE_CLIENT_SECRET": "${GDRIVE_CLIENT_SECRET}"
      }
    }
  }
}
```

**Important considerations:**

⚠️ **Context consumption:** MCP servers can consume significant context (40%+ in some cases). Use the `/context` command to monitor usage and disable unused servers.

**Best practices:**
1. Only enable MCP servers you're actively using
2. Monitor context usage with `/context`
3. Use environment variables for credentials (never hardcode)
4. Disable servers between sessions if not needed

### `/agents` - Create and Manage Subagents

Agents (also called subagents or custom agents) are specialized AI assistants with specific instructions and tool access. They're perfect for repetitive tasks or domain-specific work.

**Usage:**
```
/agents
```

**What are agents?**

Agents are configured AI helpers that:
- Have their own system prompts and instructions
- Can have restricted or specialized tool access
- Can be invoked by name during conversations
- Maintain their own context windows

**Configuration:**

Agents are defined in `.claude/agents/` directory:

**File:** `.claude/agents/code-reviewer.json`
```json
{
  "name": "code-reviewer",
  "description": "Reviews code for best practices and potential bugs",
  "systemPrompt": "You are an expert code reviewer. Focus on:\n- Security vulnerabilities\n- Performance issues\n- Code style and conventions\n- Potential bugs",
  "allowedTools": ["view", "grep", "search_code"],
  "model": "claude-3-5-sonnet-20241022"
}
```

**File:** `.claude/agents/test-writer.json`
```json
{
  "name": "test-writer",
  "description": "Writes comprehensive unit tests",
  "systemPrompt": "You are a test-driven development expert. Write thorough, maintainable tests with good coverage.",
  "allowedTools": ["view", "create", "edit", "bash"],
  "model": "claude-3-5-sonnet-20241022"
}
```

**Using agents:**

Once configured, invoke an agent by mentioning it:
```
@code-reviewer review the authentication module
@test-writer create tests for user-service.js
```

**Common agent types:**
- **Code reviewers** - Review PRs and suggest improvements
- **Test writers** - Generate unit/integration tests
- **Documentation writers** - Create/update docs
- **Refactoring specialists** - Improve code structure
- **Security auditors** - Find vulnerabilities

### `/vim` - Enable Vim-Style Editing

The `/vim` command enables vim keybindings in the Claude Code interface for those who prefer modal editing.

**Usage:**
```
/vim
```

**What it enables:**
- Normal mode navigation (hjkl)
- Insert mode for typing
- Visual mode for selections
- Vim commands (:w, :q, etc.)
- Search with / and ?

**Common vim commands in Claude Code:**
- `i` - Enter insert mode
- `Esc` - Return to normal mode
- `hjkl` - Navigate (left, down, up, right)
- `/` - Search forward
- `?` - Search backward
- `dd` - Delete line
- `yy` - Yank (copy) line
- `p` - Paste

**When to use it:**
- If you're a vim user and want familiar keybindings
- When editing longer prompts or messages
- For faster navigation in the interface

**Disabling vim mode:**
Run `/vim` again to toggle it off.

### `/terminal-setup` - Install Keyboard Shortcuts

The `/terminal-setup` command installs shell integration and keyboard shortcuts for your terminal.

**Usage:**
```
/terminal-setup
```

**What it installs:**

**Shell shortcuts:**
- `Ctrl+K` - Quick launch Claude Code
- `Ctrl+L` - Clear screen and start new conversation
- Shell aliases for common commands

**Integration features:**
- Directory-aware sessions (automatically set working directory)
- Command history integration
- Exit code awareness

**Supported shells:**
- Bash
- Zsh
- Fish

**Installation process:**

The command will:
1. Detect your shell
2. Add configuration to your shell RC file (~/.bashrc, ~/.zshrc, etc.)
3. Create necessary helper scripts
4. Set up keyboard shortcuts

**Example additions to ~/.zshrc:**
```bash
# Claude Code shortcuts
export CLAUDE_CODE_PATH="$HOME/.claude/bin"
alias claude="claude-code"

# Quick launch with Ctrl+K
bindkey '^k' claude-quick-launch
```

**After installation:**
Restart your shell or run:
```bash
source ~/.zshrc  # or ~/.bashrc, ~/.config/fish/config.fish
```

### `/bug` - Report Issues

The `/bug` command helps you report bugs or issues with Claude Code directly to the development team.

**Usage:**
```
/bug
```

**What it does:**
1. Opens an issue template
2. Collects diagnostic information automatically
3. Lets you describe the problem
4. Submits to the Claude Code issue tracker

**Information collected:**
- Claude Code version
- Operating system
- Shell type and version
- Node.js version (if applicable)
- Error logs (with your permission)
- Session context (anonymized)

**Before reporting a bug:**

1. **Check existing issues** - Search for similar reports
2. **Try to reproduce** - Verify the issue happens consistently
3. **Collect details** - Note what you were doing when it occurred
4. **Simplify** - Try to find the minimal reproduction case

**What to include:**

**Good bug report:**
```
Title: "bash tool fails with 'permission denied' on macOS"

Description:
When running `claude` with a bash command that writes to /usr/local,
I get a permission denied error even though the command works in my
regular terminal.

Steps to reproduce:
1. Run `claude`
2. Ask: "create a test file in /usr/local/test"
3. Error occurs when bash tool tries to execute

Expected: Should ask for sudo password or show clear error
Actual: Shows generic permission denied

Version: Claude Code 1.2.3
OS: macOS 14.1
Shell: zsh 5.9
```

**Less helpful report:**
```
Title: "it doesn't work"
Description: claude is broken, fix it
```

## Command Chaining and Workflows

You can combine multiple slash commands in your workflow:

**Example workflow:**

1. **Setup new project:**
```
/config         # Configure for the project
/mcp            # Enable necessary MCP servers
/hooks          # Set up auto-formatting
/terminal-setup # Install shortcuts
```

2. **Security-focused session:**
```
/allowed-tools  # Restrict to read-only tools
/agents         # Load security auditor agent
```

3. **Before ending session:**
```
/context        # Check context usage
```

## Best Practices

1. **Use `/help` regularly** - Discover new features and refresh your memory
2. **Configure per-project** - Use `.claude/settings.json` for team consistency
3. **Monitor with `/context`** - Keep track of token usage (see [Understanding the /context command](/2026/01/16/claude-code-context-command.html))
4. **Start restrictive** - Use `/allowed-tools` to limit permissions, expand as needed
5. **Automate repetitive tasks** - Set up `/hooks` for formatting, linting, testing
6. **Create specialized agents** - Use `/agents` for common workflows
7. **Report issues** - Use `/bug` to help improve Claude Code

## Related Commands

This article covers the main slash commands. For more on context management, see:
- [Understanding the /context command](/2026/01/16/claude-code-context-command.html)

## Resources

- [Claude Code Official Documentation](https://code.claude.com/docs)
- [Claude Code GitHub Repository](https://github.com/anthropics/claude-code)
- [Model Context Protocol Specification](https://modelcontextprotocol.io)
- [Claude Code Cheat Sheet](/tools/claude-code-cheatsheet/)

---

*Part of the [Claude Code article series](/tags/#claude-code)*
