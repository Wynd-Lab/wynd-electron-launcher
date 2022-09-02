# Changelog

All notable changes to this project will be documented in this file.

## [1.6.X]

### [1.6.9]

- fix reload notification request
- add focus on iframe

### [1.6.8]

- add allowPrerelease params into update

### [1.6.7]

- re-fix emergency not sending close crashdrawer on WPT
- change log format and add console for front page

### [1.6.6]

- fix emergency not sending close crashdrawer on WPT

### [1.6.5]

- add publish in config

### [1.6.4]

- add 32 bits version (CI)

### [1.6.0]

- change log and add daily rotation

## [1.5.X]

### [1.5.7]

- fix wpt.cwd can be undefined (config validation)

### [1.5.6]

- fix remove auto add index.html on front part. ( only add if path is a file ) \[regression\]
- close menu if password modal is opened

### [1.5.5]

- add EL_CONFIG_PATH to set the config path
- add more wpt options

### [1.5.4]

- fix wpt process shutting down on Windows. ( add wpt.keep_listeners = 1 in config.init)

### [1.5.3]

- remove auto add index.html on front part. ( only add if path is a file )

### [1.5.2]

- fix plugins
- reload do not close dev tools if opened (Ctrl + shift + I)

### [1.5.1]

- remove strict keys on config
- enhance error on config
- fix remove wpt.path with wait on ipc set to false
- auto remove wait on ipc with .bat file

### [1.5.0]

- add central register
- add central request (update, notification, reload)
- add send log to central
- remove config.socket

## [1.4.X]

### [1.4.2]

- fix href url proxy

### [1.4.1]

- add proxy with local server

### [1.4.0]

- add proxy config
- add command line config
- nsis install per machine

## [1.3.X]

### [1.3.10]

- catch errors of embedded app in iframe and log it in app.log

### [1.3.9]

- add wpt.wait_on_ipc in config  ( disable it for old wpt version )
- fix missing non required property in config.ini to crash the app

### [1.3.8]

- disable start after install (nsis)
- failed auto update on launch will not block the app
- add container focus on show
- work more clear logs (when error)
- add app log (see: README)
- add Config description