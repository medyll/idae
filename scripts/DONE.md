 

- Created .github/workflows/main-publish.yml for the main publication workflow
- Created .github/workflows/dev-publish.yml for the development publication workflow
- Configured specific triggers for each workflow (main and dev branches)
- Set up ubuntu-latest as the execution environment in both workflows
- Configured Node.js version 20.x in the workflows
- Added code checkout step in each workflow
- Implemented dependency installation using npm ci
- Created generate-changesets.js script in the scripts/ folder
- Implemented logic to generate changesets based on Git commits
- Added execution of generate-changesets.js script in the workflows
- Configured Changesets action to manage versions and create PRs
- Added project build step using npm run build
- Created .changeset/config.json to configure Changesets
- Modified package.json to include necessary scripts
- Added package publication step in the main-publish.yml workflow
- Set up GitHub secrets for npm token
- Added detailed logging in generate-changesets.js script for debugging
- Fixed issues related to commit date extraction
- Adjusted logic to use correct package name in changesets
- Modified changeset file naming to use directory name
- Tested and debugged workflows through multiple executions
- Optimized generate-changesets.js script to properly handle monorepos
- Implemented GitHub API rate limit handling in the script
- Configured GitHub authentication in workflows for Changesets actions
- Adjusted GITHUB_TOKEN permissions in the workflows
- Verified and corrected changeset formatting issues
- Differentiated steps between main-publish.yml and dev-publish.yml workflows
- Conducted final testing of complete workflows, achieving 100% successful execution 