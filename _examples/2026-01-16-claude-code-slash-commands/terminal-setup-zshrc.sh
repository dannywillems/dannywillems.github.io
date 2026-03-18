#!/bin/zsh

# Claude Code shortcuts
export CLAUDE_CODE_PATH="$HOME/.claude/bin"
alias claude="claude-code"

# Quick launch with Ctrl+K
bindkey '^k' claude-quick-launch
