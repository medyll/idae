module.exports = {
  branches: ["main", { name: "dev", prerelease: "next" }],
  plugins: [
    "@semantic-release/commit-analyzer",
    "@semantic-release/release-notes-generator",
    "@semantic-release/changelog",
    [
      "@semantic-release/exec",
      {
        // pnpm handles the version bump and the workspace protocol transformation
        prepareCmd: "pnpm version ${nextRelease.version} --no-git-tag-version",
        publishCmd: "pnpm publish --no-git-checks --access public",
      },
    ],
    "@semantic-release/github",
    [
      "@semantic-release/git",
      {
        assets: ["CHANGELOG.md"],
        message:
          "chore(release): ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}",
      },
    ],
  ],
};
