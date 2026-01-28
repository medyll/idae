module.exports = {
  branches: ["main", { name: "dev", prerelease: "next" }],
  plugins: [
    "@semantic-release/commit-analyzer",
    "@semantic-release/release-notes-generator",
    "@semantic-release/changelog",
    [
      "@semantic-release/exec",
      {
        // 1. On met à jour la version avec pnpm (qui comprend les workspaces)
        prepareCmd: "pnpm version ${nextRelease.version} --no-git-tag-version",
        // 2. On publie : pnpm va transformer workspace:* en version réelle automatiquement
        publishCmd: "pnpm publish --no-git-checks --access public",
      },
    ],
    [
      "@semantic-release/github",
      {
        assets: "dist/*.tgz",
      },
    ],
    [
      "@semantic-release/git",
      {
        // On committe la version du package.json (qui contient toujours workspace:*)
        assets: ["package.json", "CHANGELOG.md"],
        message:
          "chore(release): ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}",
      },
    ],
  ],
};
