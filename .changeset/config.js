const { getInfo } = require("@changesets/get-github-info");

const changelogFunctions = {
  getDependencyReleaseLine: async (changesets, dependenciesUpdated) => {
    if (dependenciesUpdated.length === 0) return "";

    const changesetLinks = changesets.map(
      (changeset) =>
        `- Updated dependencies [${changeset.commit}](${changeset.link})`,
    );

    return [
      `### Dependency Updates`,
      "",
      ...changesetLinks,
      "",
      `- Updated ${dependenciesUpdated.join(", ")}`,
    ].join("\n");
  },
  getReleaseLine: async (changeset, type) => {
    const [firstLine, ...futureLines] = changeset.summary
      .split("\n")
      .map((l) => l.trimRight());

    let { links } = await getInfo({
      repo: "@medyll/idae",
      commit: changeset.commit,
    });

    return [
      `- ${firstLine}`,
      futureLines.map((l) => `  ${l}`).join("\n"),
      links,
    ].join("\n");
  },
};

module.exports = {
  changelog: changelogFunctions,
  commit: false,
  fixed: [],
  linked: [],
  access: "public",
  baseBranch: "main",
  updateInternalDependencies: "patch",
  ignore: ["@medyll/idae-socket"],
  ___experimentalUnsafeOptions_WILL_CHANGE_IN_PATCH: {
    onlyUpdatePeerDependentsWhenOutOfRange: true,
    updateInternalDependents: "always",
    useCalculatedVersionForSnapshots: true,
  },
};
