---
layout: default
title: Claude Code Cheat Sheet
permalink: /tools/claude-code-cheatsheet/
---

<style>
/* Theme switcher */
.theme-switcher {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
  margin-bottom: 1rem;
  flex-wrap: wrap;
}

.theme-btn {
  padding: 0.5rem 1rem;
  border: 2px solid #333;
  background: #1a1a1a;
  color: #ccc;
  cursor: pointer;
  border-radius: 4px;
  font-family: 'Courier New', monospace;
  font-size: 0.85rem;
  transition: all 0.2s;
}

.theme-btn:hover {
  border-color: #666;
}

.theme-btn.active {
  border-color: #00ff00;
  color: #00ff00;
}

/* Base cheatsheet styles */
.cheatsheet {
  font-family: 'Courier New', Courier, monospace;
  padding: 2rem;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.cheatsheet h1, .cheatsheet h2, .cheatsheet h3 {
  font-family: 'Courier New', Courier, monospace;
}

.cheatsheet h1 {
  text-align: center;
  padding-bottom: 1rem;
  margin-bottom: 2rem;
}

.cheatsheet h2 {
  padding-left: 1rem;
  margin-top: 2rem;
}

.cheatsheet-section {
  padding: 1rem;
  margin: 1rem 0;
  border-radius: 4px;
}

.cheatsheet table {
  width: 100%;
  border-collapse: collapse;
  margin: 1rem 0;
}

.cheatsheet th, .cheatsheet td {
  padding: 0.5rem 1rem;
  text-align: left;
}

.cheatsheet pre {
  padding: 1rem;
  overflow-x: auto;
  border-radius: 4px;
}

.cheatsheet .tip {
  padding: 0.5rem 1rem;
  margin: 1rem 0;
  border-left-width: 4px;
  border-left-style: solid;
}

.cheatsheet .ascii-header {
  text-align: center;
  white-space: pre;
  font-size: 0.45em;
  line-height: 1.1;
  margin-bottom: 1rem;
  overflow-x: auto;
}

.cheatsheet ul, .cheatsheet ol {
  padding-left: 1.5rem;
}

.cheatsheet li {
  margin: 0.3rem 0;
}

/* ===== THEME: RETRO GREEN ===== */
.theme-retro-green {
  background: #0a0a0a;
  color: #00ff00;
  border: 2px solid #00ff00;
  box-shadow: 0 0 20px rgba(0, 255, 0, 0.3);
}

.theme-retro-green h1, .theme-retro-green h2, .theme-retro-green h3 {
  color: #00ff00 !important;
  text-shadow: 0 0 10px rgba(0, 255, 0, 0.5);
}

.theme-retro-green h1 {
  border-bottom: 2px double #00ff00;
}

.theme-retro-green h2 {
  border-left: 4px solid #00ff00;
}

.theme-retro-green .cheatsheet-section {
  background: #111;
  border: 1px solid #333;
}

.theme-retro-green code {
  background: #1a1a1a !important;
  color: #ffcc00 !important;
  padding: 0.2rem 0.5rem;
  border-radius: 3px;
}

.theme-retro-green pre {
  background: #111 !important;
  border: 1px solid #333;
}

.theme-retro-green pre code {
  background: transparent !important;
  color: #00ff00 !important;
}

.theme-retro-green a {
  color: #00ccff !important;
}

.theme-retro-green th, .theme-retro-green td {
  border: 1px solid #333;
}

.theme-retro-green th {
  background: #1a1a1a;
  color: #ffcc00;
}

.theme-retro-green tr:hover {
  background: #1a1a1a;
}

.theme-retro-green .tip {
  background: #1a0a0a;
  border-left-color: #ff6600;
  color: #ff9900;
}

.theme-retro-green p, .theme-retro-green li {
  color: #00ff00;
}

.theme-retro-green strong {
  color: #ffcc00;
}

/* ===== THEME: AMBER ===== */
.theme-amber {
  background: #0a0800;
  color: #ffb000;
  border: 2px solid #ffb000;
  box-shadow: 0 0 20px rgba(255, 176, 0, 0.3);
}

.theme-amber h1, .theme-amber h2, .theme-amber h3 {
  color: #ffb000 !important;
  text-shadow: 0 0 10px rgba(255, 176, 0, 0.5);
}

.theme-amber h1 {
  border-bottom: 2px double #ffb000;
}

.theme-amber h2 {
  border-left: 4px solid #ffb000;
}

.theme-amber .cheatsheet-section {
  background: #1a1400;
  border: 1px solid #4a3a00;
}

.theme-amber code {
  background: #2a2000 !important;
  color: #ffd700 !important;
  padding: 0.2rem 0.5rem;
  border-radius: 3px;
}

.theme-amber pre {
  background: #1a1400 !important;
  border: 1px solid #4a3a00;
}

.theme-amber pre code {
  background: transparent !important;
  color: #ffb000 !important;
}

.theme-amber a {
  color: #ff8c00 !important;
}

.theme-amber th, .theme-amber td {
  border: 1px solid #4a3a00;
}

.theme-amber th {
  background: #2a2000;
  color: #ffd700;
}

.theme-amber tr:hover {
  background: #2a2000;
}

.theme-amber .tip {
  background: #2a1a00;
  border-left-color: #ff6600;
  color: #ff9900;
}

.theme-amber p, .theme-amber li {
  color: #ffb000;
}

.theme-amber strong {
  color: #ffd700;
}

/* ===== THEME: CYBERPUNK ===== */
.theme-cyberpunk {
  background: linear-gradient(135deg, #0a0014 0%, #1a0028 100%);
  color: #ff00ff;
  border: 2px solid #ff00ff;
  box-shadow: 0 0 30px rgba(255, 0, 255, 0.4), inset 0 0 60px rgba(0, 255, 255, 0.1);
}

.theme-cyberpunk h1, .theme-cyberpunk h2, .theme-cyberpunk h3 {
  color: #00ffff !important;
  text-shadow: 0 0 10px #00ffff, 0 0 20px #00ffff;
}

.theme-cyberpunk h1 {
  border-bottom: 2px solid #ff00ff;
}

.theme-cyberpunk h2 {
  border-left: 4px solid #ff00ff;
}

.theme-cyberpunk .cheatsheet-section {
  background: rgba(20, 0, 40, 0.8);
  border: 1px solid #ff00ff55;
}

.theme-cyberpunk code {
  background: #1a0033 !important;
  color: #00ffff !important;
  padding: 0.2rem 0.5rem;
  border-radius: 3px;
  text-shadow: 0 0 5px #00ffff;
}

.theme-cyberpunk pre {
  background: rgba(20, 0, 40, 0.9) !important;
  border: 1px solid #ff00ff55;
}

.theme-cyberpunk pre code {
  background: transparent !important;
  color: #ff00ff !important;
}

.theme-cyberpunk a {
  color: #ffff00 !important;
  text-shadow: 0 0 5px #ffff00;
}

.theme-cyberpunk th, .theme-cyberpunk td {
  border: 1px solid #ff00ff55;
}

.theme-cyberpunk th {
  background: #2a0044;
  color: #00ffff;
}

.theme-cyberpunk tr:hover {
  background: #2a0044;
}

.theme-cyberpunk .tip {
  background: #2a0020;
  border-left-color: #ffff00;
  color: #ffff00;
}

.theme-cyberpunk p, .theme-cyberpunk li {
  color: #ff00ff;
}

.theme-cyberpunk strong {
  color: #00ffff;
}

.theme-cyberpunk .ascii-header {
  color: #00ffff;
  text-shadow: 0 0 10px #00ffff;
}

/* ===== THEME: PAPER (Print-friendly) ===== */
.theme-paper {
  background: #fefefe;
  color: #333;
  border: 2px solid #333;
  box-shadow: 5px 5px 0 #ccc;
}

.theme-paper h1, .theme-paper h2, .theme-paper h3 {
  color: #000 !important;
  text-shadow: none;
}

.theme-paper h1 {
  border-bottom: 3px double #333;
}

.theme-paper h2 {
  border-left: 4px solid #333;
}

.theme-paper .cheatsheet-section {
  background: #f5f5f5;
  border: 1px solid #ccc;
}

.theme-paper code {
  background: #e8e8e8 !important;
  color: #c00 !important;
  padding: 0.2rem 0.5rem;
  border-radius: 3px;
}

.theme-paper pre {
  background: #f0f0f0 !important;
  border: 1px solid #ccc;
}

.theme-paper pre code {
  background: transparent !important;
  color: #333 !important;
}

.theme-paper a {
  color: #0066cc !important;
}

.theme-paper th, .theme-paper td {
  border: 1px solid #999;
}

.theme-paper th {
  background: #e0e0e0;
  color: #000;
}

.theme-paper tr:hover {
  background: #f0f0f0;
}

.theme-paper .tip {
  background: #fff8e0;
  border-left-color: #f0a000;
  color: #806000;
}

.theme-paper p, .theme-paper li {
  color: #333;
}

.theme-paper strong {
  color: #000;
}

.theme-paper .ascii-header {
  color: #333;
}

/* ===== THEME: BLUEPRINT ===== */
.theme-blueprint {
  background: #001830;
  color: #8cc8ff;
  border: 2px solid #4a90d9;
  box-shadow: 0 0 20px rgba(74, 144, 217, 0.3);
}

.theme-blueprint h1, .theme-blueprint h2, .theme-blueprint h3 {
  color: #fff !important;
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.3);
}

.theme-blueprint h1 {
  border-bottom: 2px solid #4a90d9;
}

.theme-blueprint h2 {
  border-left: 4px solid #4a90d9;
}

.theme-blueprint .cheatsheet-section {
  background: #002040;
  border: 1px solid #4a90d955;
}

.theme-blueprint code {
  background: #003060 !important;
  color: #fff !important;
  padding: 0.2rem 0.5rem;
  border-radius: 3px;
}

.theme-blueprint pre {
  background: #002040 !important;
  border: 1px solid #4a90d955;
}

.theme-blueprint pre code {
  background: transparent !important;
  color: #8cc8ff !important;
}

.theme-blueprint a {
  color: #ffcc00 !important;
}

.theme-blueprint th, .theme-blueprint td {
  border: 1px solid #4a90d955;
}

.theme-blueprint th {
  background: #003060;
  color: #fff;
}

.theme-blueprint tr:hover {
  background: #003060;
}

.theme-blueprint .tip {
  background: #002850;
  border-left-color: #ffcc00;
  color: #ffcc00;
}

.theme-blueprint p, .theme-blueprint li {
  color: #8cc8ff;
}

.theme-blueprint strong {
  color: #fff;
}

.theme-blueprint .ascii-header {
  color: #4a90d9;
}
</style>

<div class="theme-switcher">
  <button class="theme-btn active" onclick="setTheme('retro-green')">Retro Green</button>
  <button class="theme-btn" onclick="setTheme('amber')">Amber</button>
  <button class="theme-btn" onclick="setTheme('cyberpunk')">Cyberpunk</button>
  <button class="theme-btn" onclick="setTheme('blueprint')">Blueprint</button>
  <button class="theme-btn" onclick="setTheme('paper')">Paper (Print)</button>
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
<tr><td>Memory file</td><td>Project context</td><td><code>CLAUDE.md</code> (repo root)</td></tr>
<tr><td>Custom agents</td><td>Subagent definitions</td><td><code>.claude/agents/</code></td></tr>
<tr><td>Custom commands</td><td>Slash commands</td><td><code>.claude/commands/</code></td></tr>
</table>
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
<li><strong>Use CLAUDE.md</strong> - Encode project conventions, build commands, standards</li>
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

  // Remove all theme classes
  cheatsheet.className = 'cheatsheet theme-' + theme;

  // Update active button
  buttons.forEach(btn => {
    btn.classList.remove('active');
    if (btn.textContent.toLowerCase().includes(theme.replace('-', ' ').split(' ')[0])) {
      btn.classList.add('active');
    }
  });

  // Update button active state more precisely
  buttons.forEach(btn => {
    btn.classList.remove('active');
  });
  event.target.classList.add('active');

  // Save preference
  localStorage.setItem('cheatsheet-theme', theme);
}

// Load saved theme on page load
document.addEventListener('DOMContentLoaded', function() {
  const savedTheme = localStorage.getItem('cheatsheet-theme');
  if (savedTheme) {
    setTheme(savedTheme);
    // Find and activate the correct button
    document.querySelectorAll('.theme-btn').forEach(btn => {
      btn.classList.remove('active');
      if (btn.textContent.toLowerCase().replace(/[^a-z]/g, '').includes(savedTheme.replace('-', ''))) {
        btn.classList.add('active');
      }
    });
  }
});
</script>
