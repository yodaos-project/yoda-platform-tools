#!/usr/bin/env bash

help="
Usage:
  --clean   clean builds

Example:
  $ ./scripts/build
"

clean='NO'

while [ $# -gt 0 ]; do
  case "$1" in
    --clean)
      clean="YES"
      ;;
    -h|--help)
      printf "$help"
      exit
      ;;
    -*)
      echo "Illegal option $1"
      ;;
  esac
  shift $(( $# > 0 ? 1 : 0 ))
done

if test "$clean" = 'YES'; then
  yarn workspaces run clean
  rm -rf build
fi

cd yoda-platform-lib
  npm run build
cd -

cd yoda-cli
  npm run build
cd -

cd yoda-vscode
  npm run build
cd -
