#!/usr/bin/env bash
set -x

export PKG_CACHE_PATH=$HOME/.pkg

cd yoda-cli
  npx pkg -c package.json --out-path ../build ./bin/yoda
cd -
