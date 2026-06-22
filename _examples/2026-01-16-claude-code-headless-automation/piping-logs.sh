#!/bin/bash
# Analyze logs in real-time using piping

tail -f app.log | claude -p "analyze these logs for errors and suggest fixes"
