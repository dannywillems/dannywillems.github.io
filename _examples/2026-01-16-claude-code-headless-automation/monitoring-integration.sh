#!/bin/bash
# Monitor application logs and automatically analyze errors

LOG_FILE="/var/log/myapp/error.log"
ALERT_THRESHOLD=10

# Watch for errors
tail -f "$LOG_FILE" | while read line; do
  echo "$line" | grep -i "error" && {
    # Analyze the error with Claude
    echo "$line" | claude -p "analyze this error and suggest a fix" \
      --max-turns 1 > /tmp/error-analysis.txt
    
    # Send to monitoring system
    cat /tmp/error-analysis.txt | send-to-slack.sh
  }
done
