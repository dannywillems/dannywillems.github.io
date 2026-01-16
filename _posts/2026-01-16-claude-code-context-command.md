---
layout: post
title: Understanding Claude Code's /context command
date: 2026-01-16 10:00:00 +0000
author: Danny Willems
tags: [claude, ai, tooling, productivity]
---

Claude Code is Anthropic's official CLI for Claude. As I use it daily, I wanted
to better understand how it works internally and how to optimize my
collaboration with it. The `/context` command is a useful tool for that purpose.

## What is the /context command?

Running `/context` in Claude Code displays a detailed breakdown of your current
conversation's context usage. Context is the "memory" available to Claude during
a session - it includes everything Claude needs to understand and respond to
your requests.

## Example output

Here's what the `/context` command output looks like:

```
Context Usage
⛁ ⛀ ⛁ ⛁ ⛁ ⛁ ⛁ ⛁ ⛀ ⛀ ⛀ ⛶ ⛶ ⛶ ⛶ ⛶ ⛶ ⛶ ⛶ ⛶
claude-sonnet-4-20250514 • 17k/200k tokens (8%)

⛁ System prompt:    3.2k tokens (1.6%)
⛁ System tools:   11.6k tokens (5.8%)
⛁ Custom agents:     69 tokens (0.0%)
⛁ Memory files:     743 tokens (0.4%)
⛁ MCP tools:      82.0k tokens (41.0%)
⛝ Reserved:       45.0k tokens (22.5%)
⛁ Messages:        1.2k tokens (0.6%)
⛶ Free space:    183.3k tokens (91.6%)
```

Note: The MCP tools line only appears if you have MCP servers configured. The
Reserved buffer is kept aside for auto-compact operations and output token
generation.

## Anatomy of the output

### The visual bar

The row of symbols at the top provides a visual representation of context usage:

- `⛁` (filled): Used context
- `⛀` (partial): Partially used sections
- `⛶` (empty): Free space

### Model and capacity

The line `claude-sonnet-4-20250514 • 17k/200k tokens (8%)` shows:

- **Model**: Which Claude model is being used
- **Current usage**: 17k tokens currently consumed
- **Maximum capacity**: 200k token context window
- **Percentage**: Quick overview of usage (8% in this case)

### Breakdown by category

Each category shows what's consuming your context:

| Category      | Description                                         |
| ------------- | --------------------------------------------------- |
| System prompt | Claude's base instructions for how to behave        |
| System tools  | Built-in tools (file read, bash, grep, git, etc.)   |
| Custom agents | Your `.claude/agents/` subagent definitions         |
| Memory files  | Your `CLAUDE.md` files (project context)            |
| MCP tools     | Model Context Protocol servers you've enabled       |
| Reserved      | Buffer (~40-45k) for auto-compact and output tokens |
| Messages      | Your conversation history (grows as you chat)       |
| Free space    | What's left for new content                         |

Let's explore each in more detail:

**System prompt (3.2k tokens)** The base instructions that define Claude Code's
behavior. This includes guidelines about tools, security, tone, and interaction
patterns. This is relatively fixed across sessions.

**System tools (11.6k tokens)** Definitions of all built-in tools (Bash, Read,
Write, Edit, Grep, Glob, Task, etc.). Each tool includes its description,
parameters, and usage guidelines. This is why Claude knows how to use these
tools.

**Custom agents (69 tokens)** Your custom subagent definitions from
`.claude/agents/`. These are specialized agents you can define to handle
specific types of tasks in your workflow.

**Memory files (743 tokens)** Content from `CLAUDE.md` files in your project.
These are project-specific instructions that persist across sessions. This is
where you can encode your project's conventions, build commands, and workflows.

**MCP tools (82.0k tokens)** If you have MCP (Model Context Protocol) servers
configured, their tool definitions appear here. This can be substantial if you
have many MCP tools available, as shown in this example where MCP tools consume
41% of the context window.

**Reserved (45.0k tokens)** Buffer space kept free for:

- **Autocompact**: When context fills up, Claude Code summarizes older messages.
  This reserved space ensures there's room for the summarization process.
- **Output**: Space for Claude's response generation.

**Messages (1.2k tokens)** Your conversation history - your messages and
Claude's responses. This grows as the conversation continues.

**Free space (183.3k tokens)** Available context for new messages, tool results,
and file reads.

## Why context matters

Understanding context usage helps in several ways:

### Avoiding context exhaustion

When the context fills up, Claude Code uses automatic summarization to compress
older parts of the conversation. While this works well, important details can be
lost. Monitoring context helps you decide when to start a fresh session for
unrelated tasks.

### Identifying context hogs

In the example above, MCP tools consume 41% of context. If you have many MCP
servers configured but rarely use them, you might consider disabling some to
free up space for longer conversations.

### Optimizing tool usage

If you see tool results consuming excessive context through messages, you can:

- Be more specific in file reads (use line ranges for large files)
- Use targeted grep patterns instead of broad searches
- Ask Claude to use the Task tool for exploration, which runs in a subprocess
  and returns only summaries

### Understanding Claude's knowledge

The context breakdown shows exactly what information Claude has access to. If
Claude seems to "forget" something, check if it was summarized away or never
included.

## Tips for efficient context usage

1. **Start focused sessions**: Begin new conversations for distinct tasks rather
   than running everything in one session.

2. **Use CLAUDE.md wisely**: Put important, stable instructions in your memory
   files. Don't overload them with information that changes frequently.

3. **Be specific with file operations**: Instead of reading entire large files,
   specify the sections you need.

4. **Leverage the Task tool**: For exploration tasks, Claude can spawn subagents
   that work independently and return concise summaries.

5. **Review MCP tool usage**: If MCP tools consume significant context but you
   don't use them often, consider streamlining your MCP configuration.

6. **Check /context periodically**: Especially during long sessions, monitor
   usage to understand when context pressure might affect quality.

## The mental model

Think of context as Claude's "working memory" for the current session. Just like
humans, there's a limit to how much can be actively held in mind. The /context
command gives you visibility into this constraint, enabling you to work with
Claude more effectively.

Understanding these mechanics has improved my collaboration with Claude Code. I
now structure my requests differently, start fresh sessions strategically, and
use memory files to encode persistent project knowledge rather than repeating it
each session.

## Further resources

- [Claude Code documentation](https://docs.anthropic.com/en/docs/claude-code)
- [Anthropic's context window documentation](https://docs.anthropic.com/en/docs/build-with-claude/context-windows)
