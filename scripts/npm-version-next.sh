#!/bin/bash
set -e

# 1. Bump version and create git tag (choose your bump type: patch/minor/major/prerelease)
npm version prerelease --preid=latest

# 2. Push commits and tags to origin
git push --follow-tags

# 3. Publish to npm with tag 'latest'
npm publish --tag latest
