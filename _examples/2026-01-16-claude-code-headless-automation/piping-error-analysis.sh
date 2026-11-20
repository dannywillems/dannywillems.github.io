#!/bin/bash
# Analyze error output from a command

npm test 2>&1 | claude -p "explain why these tests failed and suggest fixes"
