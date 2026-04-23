#!/bin/bash
# Analyze a file using piping

cat error.txt | claude -p "explain this error and how to fix it"
