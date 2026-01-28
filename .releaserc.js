module.exports = {
  branches: ["main", { name: "dev", prerelease: "next" }],
  plugins: [
    "@semantic-release/commit-analyzer",
    "@semantic-release/release-notes-generator",
    "@semantic-release/changelog",
    [
      "@semantic-release/exec",
      {
        // On utilise pnpm pour bumper la version sans créer de tag git
        prepareCmd: "pnpm version ${nextRelease.version} --no-git-tag-version",
        // On laisse pnpm publish gérer la conversion workspace:* -> version réelle
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
        assets: ["package.json", "CHANGELOG.md"],
        message:
          "chore(release): ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}",
      },
    ],
  ],
};
