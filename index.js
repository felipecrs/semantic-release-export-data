// @ts-check

import process from "node:process";
import { appendFile } from "node:fs/promises";
import { EOL } from "node:os";
import { randomUUID } from "node:crypto";

async function exportData(name, value, { log = true, escape = false } = {}) {
  if (log) {
    console.log(`semantic-release-export-data: ${name}=${value}`);
  }
  if (process.env.GITHUB_OUTPUT) {
    let output;
    if (escape) {
      // Borrowed from https://github.com/actions/toolkit/blob/ddc5fa4ae84a892bfa8431c353db3cf628f1235d/packages/core/src/file-command.ts#L27  
      const delimiter = "output_delimiter_".concat(randomUUID());
      output = `${name}<<${delimiter}${EOL}${value}${EOL}${delimiter}${EOL}`;
    } else {
      output = `${name}=${value}${EOL}`;
    }
    await appendFile(process.env.GITHUB_OUTPUT, output);
  }
}

export async function verifyConditions() {
  await exportData("new-release-published", "false");
}

export async function generateNotes(_pluginConfig, { nextRelease }) {
  await exportData("new-release-published", "true");
  await exportData("new-release-version", nextRelease.version);
  await exportData("new-release-git-tag", nextRelease.gitTag);
  await exportData("new-release-notes", nextRelease.notes, { log: false, escape: true });
}
