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
