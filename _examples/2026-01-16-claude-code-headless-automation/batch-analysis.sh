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
