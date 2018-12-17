# YodaOS VSCode Development Kit

[![Build Status](https://travis-ci.com/yodaos-project/yoda-platform-tools.svg?branch=master)](https://travis-ci.com/yodaos-project/yoda-platform-tools)
[![Licence](https://img.shields.io/github/license/yodaos-project/yoda-platform-tools.svg)](https://github.com/yodaos-project/yoda-platform-tools)
[![VS Code Marketplace](https://vsmarketplacebadge.apphb.com/version-short/yodaos.yoda-vscode.svg) ![Rating](https://vsmarketplacebadge.apphb.com/rating-short/yodaos.yoda-vscode.svg) ![Installs](https://vsmarketplacebadge.apphb.com/installs/yodaos.yoda-vscode.svg)](https://marketplace.visualstudio.com/items?itemName=yodaos.yoda-vscode)

## Features

A VSCode extension provides easy commands on YodaOS devices and apps installation from workspaces.

### Commands

#####  YodaOS: Launch App
  Installs app from current directory to device /opt/apps.

##### YodaOS: Open Url
  Opens a given url on device.

##### YodaOS: Text Nlp
  Parses a given text phrase on device and execute it.

## Requirements

- adb version >= 40

## Extension Settings

##### yoda.installOptions

Options used on command `YodaOS: Launch App`.
