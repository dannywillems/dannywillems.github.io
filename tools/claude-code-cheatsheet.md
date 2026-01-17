---
layout: default
title: Claude Code Cheat Sheet
permalink: /tools/claude-code-cheatsheet/
---

<link rel="stylesheet" href="{{ '/assets/css/cheatsheet.css' | relative_url }}">

<div class="theme-switcher">
  <button class="theme-btn active" onclick="setTheme('retro-green')">Retro Green</button>
  <button class="theme-btn" onclick="setTheme('amber')">Amber</button>
  <button class="theme-btn" onclick="setTheme('cyberpunk')">Cyberpunk</button>
  <button class="theme-btn" onclick="setTheme('blueprint')">Blueprint</button>
  <button class="theme-btn" onclick="setTheme('paper')">Paper</button>
</div>

<div id="cheatsheet" class="cheatsheet theme-retro-green">

<div class="ascii-header">
 ██████╗██╗      █████╗ ██╗   ██╗██████╗ ███████╗     ██████╗ ██████╗ ██████╗ ███████╗
██╔════╝██║     ██╔══██╗██║   ██║██╔══██╗██╔════╝    ██╔════╝██╔═══██╗██╔══██╗██╔════╝
██║     ██║     ███████║██║   ██║██║  ██║█████╗      ██║     ██║   ██║██║  ██║█████╗
██║     ██║     ██╔══██║██║   ██║██║  ██║██╔══╝      ██║     ██║   ██║██║  ██║██╔══╝
╚██████╗███████╗██║  ██║╚██████╔╝██████╔╝███████╗    ╚██████╗╚██████╔╝██████╔╝███████╗
 ╚═════╝╚══════╝╚═╝  ╚═╝ ╚═════╝ ╚═════╝ ╚══════╝     ╚═════╝ ╚═════╝ ╚═════╝ ╚══════╝
</div>

<h1>Claude Code Cheat Sheet</h1>

<p style="text-align: center; opacity: 0.7;">
Quick reference for Anthropic's CLI coding assistant<br/>
Last updated: January 2026
</p>

<div class="cheatsheet-section" style="text-align: center;">
<strong>Quick Links:</strong>
<a href="#installation">Installation</a> |
<a href="#slash-commands">Slash Commands</a> |
<a href="#config-files">Config Files</a> |
<a href="#context">Context</a> |
<a href="#github">GitHub</a> |
<a href="#cli">CLI</a> |
<a href="#hooks">Hooks</a> |
<a href="#mcp">MCP</a> |
<a href="#shortcuts">Shortcuts</a> |
<a href="#best-practices">Best Practices</a> |
<a href="#resources">Resources</a>
</div>

<h2 id="installation">Installation</h2>

<div class="cheatsheet-section">
<table>
<tr><th>Platform</th><th>Command</th></tr>
<tr><td>macOS/Linux</td><td><code>curl -fsSL https://claude.ai/install.sh | bash</code></td></tr>
<tr><td>Homebrew</td><td><code>brew install --cask claude-code</code></td></tr>
<tr><td>Windows</td><td><code>irm https://claude.ai/install.ps1 | iex</code></td></tr>
<tr><td>WinGet</td><td><code>winget install Anthropic.ClaudeCode</code></td></tr>
</table>
</div>

<h2 id="slash-commands">Slash Commands</h2>

<div class="cheatsheet-section">
<table>
<tr><th>Command</th><th>Description</th></tr>
<tr><td><code>/agents</code></td><td>Create and manage subagents</td></tr>
<tr><td><code>/allowed-tools</code></td><td>Manage tool permissions</td></tr>
<tr><td><code>/bug</code></td><td>Report issues</td></tr>
<tr><td><code>/config</code></td><td>Interactive settings configuration</td></tr>
<tr><td><code>/context</code></td><td>View context usage breakdown</td></tr>
<tr><td><code>/help</code></td><td>Display all available commands</td></tr>
<tr><td><code>/hooks</code></td><td>Set up automation triggers</td></tr>
<tr><td><code>/install-github-app</code></td><td>Set up GitHub Actions integration</td></tr>
<tr><td><code>/mcp</code></td><td>Configure MCP servers</td></tr>
<tr><td><code>/terminal-setup</code></td><td>Install keyboard shortcuts</td></tr>
<tr><td><code>/vim</code></td><td>Enable vim-style editing</td></tr>
</table>

<p><a href="/2026/01/16/claude-code-slash-commands.html">Read more: Comprehensive slash commands guide</a></p>

<div class="tip">
Tip: Use /context regularly to monitor token usage and avoid context exhaustion.
</div>
</div>

<h2 id="config-files">Configuration Files</h2>

<div class="cheatsheet-section">
<table>
<tr><th>File</th><th>Scope</th><th>Location</th></tr>
<tr><td>User settings</td><td>All projects</td><td><code>~/.claude/settings.json</code></td></tr>
<tr><td>Project settings</td><td>Team (git tracked)</td><td><code>.claude/settings.json</code></td></tr>
<tr><td>Local settings</td><td>Personal (git ignored)</td><td><code>.claude/settings.local.json</code></td></tr>
<tr><td>Memory file</td><td>Project context</td><td><code>CLAUDE.md</code> (hierarchical)</td></tr>
<tr><td>Custom agents</td><td>Subagent definitions</td><td><code>.claude/agents/</code></td></tr>
<tr><td>Custom commands</td><td>Slash commands</td><td><code>.claude/commands/</code></td></tr>
</table>

<p><a href="/2026/01/16/claude-code-memory-system.html">Read more: CLAUDE.md memory system explained</a></p>
</div>

<h2 id="context">Context Categories</h2>

<div class="cheatsheet-section">
<table>
<tr><th>Category</th><th>Description</th></tr>
<tr><td>System prompt</td><td>Claude's base instructions</td></tr>
<tr><td>System tools</td><td>Built-in tools (Read, Write, Bash, etc.)</td></tr>
<tr><td>Custom agents</td><td>Your <code>.claude/agents/</code> definitions</td></tr>
<tr><td>Memory files</td><td>Your <code>CLAUDE.md</code> files</td></tr>
<tr><td>MCP tools</td><td>Model Context Protocol servers</td></tr>
<tr><td>Reserved</td><td>Buffer (~40-45k) for auto-compact</td></tr>
<tr><td>Messages</td><td>Conversation history</td></tr>
<tr><td>Free space</td><td>Available for new content</td></tr>
</table>

<p><a href="/2026/01/16/claude-code-context-command.html">Read more: Understanding the /context command</a></p>
</div>

<h2 id="github">GitHub Integration</h2>

<div class="cheatsheet-section">
<p><strong>Quick Setup:</strong></p>
<pre><code>/install-github-app</code></pre>

<p><strong>@claude Mentions:</strong></p>
<pre><code>@claude review this PR
@claude fix the TypeError in dashboard
@claude implement user authentication
@claude /review</code></pre>

<p><strong>Local Git Operations:</strong></p>
<pre><code>commit these changes
create a pr for this branch
what changes made it into v1.2.3?</code></pre>

<p><a href="/2026/01/16/claude-code-github-workflow.html">Read more: GitHub workflow integration</a></p>
</div>

<h2 id="cli">CLI Arguments</h2>

<div class="cheatsheet-section">
<table>
<tr><th>Argument</th><th>Description</th></tr>
<tr><td><code>-p "prompt"</code></td><td>Print mode (single query, then exit)</td></tr>
<tr><td><code>--model &lt;model&gt;</code></td><td>Specify Claude model</td></tr>
<tr><td><code>--max-turns &lt;n&gt;</code></td><td>Limit conversation turns</td></tr>
<tr><td><code>--allowed-tools &lt;list&gt;</code></td><td>Restrict available tools</td></tr>
<tr><td><code>--mcp-config &lt;path&gt;</code></td><td>MCP configuration file</td></tr>
<tr><td><code>--debug</code></td><td>Enable debug output</td></tr>
</table>

<p><strong>Piping:</strong></p>
<pre><code>tail -f app.log | claude -p "analyze these logs"
cat error.txt | claude -p "explain this error"</code></pre>
</div>

<h2 id="hooks">Hooks</h2>

<div class="cheatsheet-section">
<table>
<tr><th>Hook</th><th>Trigger</th></tr>
<tr><td><code>PreToolUse</code></td><td>Before a tool is executed</td></tr>
<tr><td><code>PostToolUse</code></td><td>After a tool completes</td></tr>
<tr><td><code>UserPromptSubmit</code></td><td>When user sends a message</td></tr>
<tr><td><code>SessionStart</code></td><td>When a new session begins</td></tr>
</table>

<p><strong>Example use cases:</strong></p>
<ul>
<li>Auto-format code after edits</li>
<li>Run linters before commits</li>
<li>Send notifications on completion</li>
</ul>
</div>

<h2 id="mcp">MCP (Model Context Protocol)</h2>

<div class="cheatsheet-section">
<p>Connect external tools and data sources:</p>
<ul>
<li>Google Drive (design docs)</li>
<li>Figma (designs)</li>
<li>Slack (team communication)</li>
<li>Jira (issue tracking)</li>
<li>Custom tooling</li>
</ul>

<p><strong>Setup:</strong></p>
<pre><code>/mcp</code></pre>

<p><a href="/2026/01/17/claude-code-mcp.html">Read more: MCP (Model Context Protocol) explained</a></p>

<div class="tip">
Warning: MCP tools can consume significant context (40%+). Disable unused servers.
</div>
</div>

<h2 id="shortcuts">Keyboard Shortcuts</h2>

<div class="cheatsheet-section">
<table>
<tr><th>Shortcut</th><th>Action</th></tr>
<tr><td><code>Ctrl+C</code></td><td>Cancel current operation</td></tr>
<tr><td><code>Ctrl+D</code></td><td>Exit Claude Code</td></tr>
<tr><td><code>Tab</code></td><td>Autocomplete</td></tr>
<tr><td><code>Up/Down</code></td><td>Navigate history</td></tr>
<tr><td><code>Ctrl+T</code></td><td>Toggle syntax highlighting (in /theme)</td></tr>
</table>

<p><strong>Install terminal shortcuts:</strong></p>
<pre><code>/terminal-setup</code></pre>
</div>

<h2 id="best-practices">Best Practices</h2>

<div class="cheatsheet-section">
<ol>
<li><strong>Use CLAUDE.md</strong> - Encode project conventions, build commands, standards (<a href="/2026/01/16/claude-code-memory-system.html">guide</a>)</li>
<li><strong>Start focused sessions</strong> - New conversations for distinct tasks</li>
<li><strong>Be specific</strong> - Target file reads, specific grep patterns</li>
<li><strong>Use Task tool</strong> - Let Claude spawn subagents for exploration</li>
<li><strong>Monitor /context</strong> - Avoid context exhaustion</li>
<li><strong>Review changes</strong> - Always review before accepting</li>
</ol>
</div>

<h2 id="resources">Resources</h2>

<div class="cheatsheet-section">
<ul>
<li><a href="https://code.claude.com/docs/en/overview">Official Docs</a></li>
<li><a href="https://github.com/anthropics/claude-code">GitHub Repository</a></li>
<li><a href="https://github.com/anthropics/claude-code-action">GitHub Action</a></li>
<li><a href="https://www.anthropic.com/engineering/claude-code-best-practices">Best Practices</a></li>
</ul>
</div>

<p style="text-align: center; opacity: 0.5; margin-top: 2rem; font-size: 0.9em;">
[ More articles coming soon - check back for updates ]
</p>

</div>

<script>
function setTheme(theme) {
  const cheatsheet = document.getElementById('cheatsheet');
  const buttons = document.querySelectorAll('.theme-btn');

  // Update cheatsheet class
  cheatsheet.className = 'cheatsheet theme-' + theme;

  // Update active button
  buttons.forEach(btn => btn.classList.remove('active'));
  if (event && event.target) {
    event.target.classList.add('active');
  }

  // Save preference
  localStorage.setItem('cheatsheet-theme', theme);
}

// Load saved theme on page load
document.addEventListener('DOMContentLoaded', function() {
  const savedTheme = localStorage.getItem('cheatsheet-theme');
  if (savedTheme) {
    const cheatsheet = document.getElementById('cheatsheet');
    cheatsheet.className = 'cheatsheet theme-' + savedTheme;

    // Activate correct button
    const themeMap = {
      'retro-green': 'Retro Green',
      'amber': 'Amber',
      'cyberpunk': 'Cyberpunk',
      'blueprint': 'Blueprint',
      'paper': 'Paper'
    };
    document.querySelectorAll('.theme-btn').forEach(btn => {
      btn.classList.remove('active');
      if (btn.textContent === themeMap[savedTheme]) {
        btn.classList.add('active');
      }
    });
  }
});
</script>
