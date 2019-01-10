# yoda-cli

[![Build Status](https://travis-ci.com/yodaos-project/yoda-platform-tools.svg?branch=master)](https://travis-ci.com/yodaos-project/yoda-platform-tools)

Command line interface to interact with YodaOS devices.

## Usage

### yoda-am

Tool to interact with applications.

##### yoda-am nlp <text>

Parse the text and open appropriate app to handle parsed intent.

##### yoda-am open-url <url>

Open a url on device. The url would be dispatched to an app registered for the hostname.

##### yoda-am launch <package-name>

Launch an app on device.

##### yoda-am force-stop <package-name>

Force stop an app on device.


### yoda-pm

##### yoda-pm list

Get info of all packages on device.

##### yoda-pm path <package-name>

Get package directory on device.

##### yoda-pm install <package-local-path>

Install an app from local package path.


### yoda-debug

##### yoda-debug get-lifetime

Get YodaOS lifetime stats.

##### yoda-debug get-turen-state

Get YodaOS wake up stats.

#####yoda-debug get-loader

Get YodaOS application loader stats.

#####yoda-debug mock-asr <text>

Mock a voice command.

#####yoda-debug mock-key <event> <key-code>

Mock a key event.

#####yoda-debug mock-key-longpress <key-code> <press-time> [event-window]

Mock a key longpress gesture.
