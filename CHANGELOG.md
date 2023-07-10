# Changelog

All notable changes to this project will be documented in this file.

## [1.15.X]

### [1.15.0]

- enable .exe for wpt

## [1.14.X]

### [1.14.2]

- fix loader message (wpt creation)
- add wpt to register if wpt.path is set
- add REDUX_DEV_TOOLS (available on debug mode)
- rework and fix on central request routes

### [1.14.1]

- add EL_DISABLE_HDA(=1) to disable hardware acceleration

### [1.14.0]

- remove ipc to socketio client

## [1.13.X]

### [1.13.4]

- fix validation conflict when value is false

### [1.13.3]

- fix tray icon path access when packaged
- fix node ipc no connecting to api updater

### [1.13.2]

- add node-ipc log
- wait wpt connect if enable to diplay iframe/webview(app)
- config validation: check wait on ipc conflict with detached or shell

### [1.13.1]

- change node-ipc to a safe fork
- change git hub publish CI

### [1.13.0]

- add ipc communication with api updater
- remove pinpad popup  when clicking on wpt icon to return in the main page
- enable env variable in config

## [1.12.X]

### [1.12.0]

- add pin code for wpt icon conf -> wpt.password
- add ctrl+shift+R to reload + clear cache
- on reload the http server will not be restart (destroy and created) -> no conf.http will be take into account
- on reload the wpt server will not be restart (destroy and created) -> no conf.wpt will be take into account
- fix log message (only single parameters now)

## [1.11.X]

### [1.11.5]

- add timeout in http close on reload

### [1.11.4]

- temporary remove http close on reload

### [1.11.3]

- fix wpt central communication (wpt > 1.22.6)

### [1.11.2]

- fix err code
- fix loader
- fix wpt connection (front menu)

### [1.11.1]

- fix err code
- loader progress
- add title instead of name

### [1.11.0]

- add solid border option
- add menu button size and position parameters (menu.button_size && menu.button_position)
- add color to menu button on debug mode
- add ctrl + m to show menu
- change frameless to frame
- fix frame parameter not correctly converted in boolean

### [1.10.2]

- add debug mode
- fix loader for init reload, update

### [1.10.1]

- fix antd items Menu

### [1.10.0]

- upgrade node to 16.16.0
- upgrade electron to 21.0.1
- upgrade react, antd
- upgrade fastify
- add ci workflow on develop push
- fix ci issue with nodejs and electron conflict version

## [1.9.X]

### [1.9.2]

- maximize app if not frameless

### [1.9.1]

### [1.9.0]

- fix default config keep_listener
- add fullscreen params
- add kiosk params
- add frameless params

## [1.8.X]

### [1.8.1]

- add commandline log

### [1.8.0]

- add default config generation
- add wpt timeout parameters (see: README)

## [1.7.X]

### [1.7.1]

- fix clear-cache: webframe undefined
- fix anycommerce icon
- fix windows icon

### [1.7.0]

- change default log menu and windows icons
- add logo customization
- add check central plugin
- add clear cache on reload
- re add delay to close the app on emergency
- rework central.message (update, notification, config.get, config.set, config.wpt.set, reload)
- fix multiple central.register
- fix socket leak memory on wpt reload

## [1.6.X]

### [1.6.11]

- add portable version

### [1.6.10]

- prevent wpt to be killed before sending message (emergency)
- remove delay to close the app on emergency

### [1.6.9]

- fix reload notification request
- add focus on iframe
- add delay to close the app on emergency (case where wpt process has been created by electron launcher)

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
