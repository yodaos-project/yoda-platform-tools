#!/usr/bin/env bash
set -ex

export PKG_CACHE_PATH=$HOME/.pkg

target=$(uname)

if test $target = "Darwin"; then
  target=macos
else
  target=linux
fi

cd yoda-cli
  npx pkg -t node10-$target -c package.json --out-path ../build ./bin/yoda
cd -

cd yoda-platform-lib
  cp $(node -e "console.log(path.join(path.dirname(require.resolve('flora')), 'flora-cli.node'))") ../build
cd -
