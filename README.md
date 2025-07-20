# semantic-release-export-data

[semantic-release](https://github.com/semantic-release/semantic-release) plugin to export variables like the next release version. Also works in `--dry-run` mode.

[![npm](https://img.shields.io/npm/v/semantic-release-export-data.svg)](https://www.npmjs.com/package/semantic-release-export-data)
[![downloads](https://img.shields.io/npm/dt/semantic-release-export-data.svg)](https://www.npmjs.com/package/semantic-release-export-data)
[![ci](https://github.com/felipecrs/semantic-release-export-data/workflows/ci/badge.svg)](https://github.com/felipecrs/semantic-release-export-data/actions?query=workflow%3Aci)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

| Step               | Description                                                                                        |
| ------------------ | -------------------------------------------------------------------------------------------------- |
| `verifyConditions` | Set `new-release-published` as `false` (will be set later as `true` if a new release is published) |
| `generateNotes`    | If a new release is published, this will set `new-release-published` as `true` and other variables |

## Install

```bash
npm install --save-dev semantic-release-export-data
```

OR

```bash
yarn add -D semantic-release-export-data
```

## Usage

The plugin can be configured in the [**semantic-release** configuration file](https://github.com/semantic-release/semantic-release/blob/master/docs/usage/configuration.md#configuration):

```json
{
  "plugins": ["semantic-release-export-data"]
}
```

### Outputs

Currently, the plugin exports the following GitHub Actions's outputs:

| Output                  | Description                                                                                           |
| ----------------------- | ----------------------------------------------------------------------------------------------------- |
| `new-release-published` | Whether a new release was published. The return value is in the form of a string. (`true` or `false`) |
| `new-release-version`   | If a new release was published, the version of the new release. (e.g. `1.3.0`)                        |
| `new-release-git-tag`   | If a new version is determined, the git tag of the new release. (e.g. `v1.3.0`)                       |

### GitHub Actions Example

```yaml
name: ci

on:
  push:
    branches: [master]

jobs:
  get-next-version:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 16
      - run: npm ci
      - run: npx semantic-release --dry-run
        id: get-next-version
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
    outputs:
      new-release-published: ${{ steps.get-next-version.outputs.new-release-published }}
      new-release-version: ${{ steps.get-next-version.outputs.new-release-version }}
      new-release-git-tag: ${{ steps.get-next-version.outputs.new-release-git-tag }}

  build:
    runs-on: ubuntu-latest
    needs: get-next-version
    if: needs.get-next-version.outputs.new-release-published == 'true'
    steps:
      - uses: actions/checkout@v3
      - run: echo "The new release version is ${{ needs.get-next-version.outputs.new-release-version }}"
      - run: echo "The new release git tag is ${{ needs.get-next-version.outputs.new-release-git-tag }}"


  release:
    runs-on: ubuntu-latest
    needs: build
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 16
      - run: npm ci
      - run: npx semantic-release
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

## Why?

Because of https://github.com/felipecrs/semantic-release-vsce/issues/189#issuecomment-1115021771 and https://github.com/semantic-release/semantic-release/issues/1647.

## Thanks

Inspired by the awesome [semantic-release-action](https://github.com/cycjimmy/semantic-release-action) by @cycjimmy, although this provides the ability of running `semantic-release` in `--dry-run` mode, so you don't have to cut a release unless everything else is done.
