#!/usr/bin/env bash
set -x

cd yoda-platform-lib
  yarn
  npm publish
cd -

cd yoda-cli
  yarn
  npm publish
cd -

cd yoda-vscode
  yarn
  npx vsce publish --yarn
cd -
