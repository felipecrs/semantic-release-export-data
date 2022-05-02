function setOutput(name, value, stdout) {
  stdout.write(`::set-output name=${name}::${value}\n`);
}

function verifyConditions(_pluginConfig, { stdout }) {
  setOutput("new-release-published", "false", stdout);
}

function generateNotes(pluginConfig, { nextRelease, stdout }) {
  setOutput("new-release-published", "true", stdout);
  setOutput("new-release-version", nextRelease.version, stdout);
}

module.exports = {
  verifyConditions,
  generateNotes,
};
