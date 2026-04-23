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
