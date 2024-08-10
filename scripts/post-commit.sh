#!/usr/bin/env sh
#!/bin/sh

# Name of the main branch
MAIN_BRANCH="main"

# Log file
LOG_FILE=".git/pull_needed.log"

# Update remote references
git fetch origin $MAIN_BRANCH > /dev/null 2>&1

# Check if a pull is necessary
if [ "$(git rev-parse HEAD)" != "$(git rev-parse origin/$MAIN_BRANCH)" ]; then
    echo "$(date): A pull from $MAIN_BRANCH is needed after commit $(git rev-parse --short HEAD)" >> $LOG_FILE
    echo "A pull from $MAIN_BRANCH is recommended. See $LOG_FILE for details."
fi