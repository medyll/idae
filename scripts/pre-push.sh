#!/bin/sh

# Name of the main branch
MAIN_BRANCH="main"

# Current branch
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)

# If we're not on the main branch
if [ "$CURRENT_BRANCH" != "$MAIN_BRANCH" ]; then
  echo "Your branch '$CURRENT_BRANCH' is diverging from '$MAIN_BRANCH'. Do you want to pull? (y/N)"
  read -r response

  if [ "$response" = "y" ] || [ "$response" = "Y" ]; then
    echo "Updating branch '$CURRENT_BRANCH' with '$MAIN_BRANCH'..."
    git fetch origin "$MAIN_BRANCH"
    if git merge origin/"$MAIN_BRANCH"; then
      echo "Merge successful."
    else
      echo "Merge failed. Do you want to abort the merge? (y/N)"
      read -r abort_response
      if [ "$abort_response" = "y" ] || [ "$abort_response" = "Y" ]; then
        git merge --abort
        echo "Merge aborted."
        exit 1
      else
        echo "Resolve conflicts before pushing."
        exit 1
      fi
    fi
  else
    echo "Pull cancelled. You can continue to push."
  fi
fi

exit 0