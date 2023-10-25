// @ts-check

const core = require('@actions/core');

function verifyConditions() {
  core.setOutput("new-release-published", "false");
}

function generateNotes(_pluginConfig, { nextRelease }) {
  core.setOutput("new-release-published", "true");
  core.setOutput("new-release-version", nextRelease.version);
  core.setOutput("new-release-notes", nextRelease.notes);
}

module.exports = {
  verifyConditions,
  generateNotes,
};
