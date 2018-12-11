#!/usr/bin/env bash

export PKG_CACHE_PATH=$HOME/.pkg

cd yoda-cli
  npx pkg --out-path ../build ./bin/yoda-am
  npx pkg --out-path ../build ./bin/yoda-debug
cd -
