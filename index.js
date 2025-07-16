// @ts-check

const { env } = require("node:process");
const { appendFileSync } = require("node:fs");

function exportData(name, value) {
  console.log(`semantic-release-export-data: ${name}=${value}`);
  if (env.GITHUB_OUTPUT) {
    const output = `${name}=${value}\n`;
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
}

module.exports = {
  verifyConditions,
  generateNotes,
};
