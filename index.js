// @ts-check

const { env } = require("node:process");
const { appendFileSync } = require("node:fs");
const { EOL } = require("node:os");
const { randomUUID } = require("node:crypto");

function exportData(name, value) {
  console.log(`semantic-release-export-data: ${name}=${value}`);
  if (env.GITHUB_OUTPUT) {
    // Borrowed from https://github.com/actions/toolkit/blob/ddc5fa4ae84a892bfa8431c353db3cf628f1235d/packages/core/src/file-command.ts#L27  
    const delimiter = "output_delimiter_".concat(randomUUID());
    const output = "".concat(name, "<<", delimiter, EOL, value, EOL, delimiter, EOL);
    appendFileSync(env.GITHUB_OUTPUT, output);
  }
}

function verifyConditions() {
  exportData("new-release-published", "false");
}

function generateNotes(_pluginConfig, { nextRelease }) {
  exportData("new-release-published", "true");
  exportData("new-release-version", nextRelease.version);
  exportData("new-release-git-tag", nextRelease.gitTag);
  // Export notes if present
  nextRelease.notes && exportData("new-release-release-notes", nextRelease.notes);
}

module.exports = {
  verifyConditions,
  generateNotes,
};
