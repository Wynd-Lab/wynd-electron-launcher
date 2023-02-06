# Wynd Electron Launcher

## Config

### Where

* windows: Répertoire de données par utilisateur de l'application, pointant par défaut sur, %APPDATA%/electron-launcher (ex: C:\User\<User>\AppData\Roaming\electron-launcher)
* linux: $XDG_CONFIG_HOME/electron-launcher ou ~/.config/electron-launcher
* macos: ~/Library/Application/electron-launcher

#### Set config path

* by adding command line option --config_path (ex: electron-launcher-1.0.0.AppImage --config_path /home/user)
* by set the environment variable EL_CONFIG_PATH

### Propreties

#### url

* required: true if no embedded front
* value: http url or path or nothing
* description:  if enable, the front will not be embedded in a  can be an url or a local path(1)(2). If no url, the app will look into the src/local inside the app ( for embedded front ).

   (1) For relative path (ex: ./remote). The app will look in the config path.

   (2) The folder should have an index.html file

* examples

   <http://localhost:4000>
   ./remote
   /home/toto/remote

#### raw

* required: false
* value: 0/1, false/true
* description:  if enable, the front will not be embedded in an iframe

#### screen

* required: false
* value: 0/1, false/true
* description: choose the screen to display the app. (in case of multiple screen )
* note:  this can be set by adding command line option --screen

#### view

* required: false
* value: iframe/webview
* default: iframe
* description: choose the html element which will contains the app

#### kiosk

* required: false
* value: boolean
* default: true
* description: choose to display in kiosk mode

#### full_screen

* required: false
* value: boolean
* default: true
* description: choose to display in full screen mode

#### frame

* required: false
* value:boolean
* default: false
* description: choose to display in frame mode

#### debug

* required: false
* value:boolean
* default: false
* description: add debug mode (display menu button and browser inspector)

#### border

* required: false
* value:boolean
* default: false
* description: display border

#### title

* required: false
* value:boolean
* default: false
* description: customize title (frame mode)

#### [menu]

* enable
  * required: false
  * value: 0/1, false/true
  * default: 1
  * description:  if enable, it will display the menu bar, click on the lower left corner to make it appears

* email
  * required: false
  * value: string
  * default: false
  * description:  if enable, it will display the menu "support"

* phone
  * required: false
  * value: string
  * default: 1
  * description: if enable, it will display the menu "support"

* password:
  * required: false
  * value: 0/1, false/true
  * default: 0
  * description: if enable, required a password to access SUPPORT, RELOAD, CLOSE on click menu and, inspect mode (CTRL + SHIFT + I)

* logo
  * required: false
  * value: string
  * default: Logo.png
  * description: set logo filename in {AppPath}/assets folder

* button_size:

  * required: false
  * value: integer
  * default: 10
  * description: set the button size

* button_position:

  * required: false
  * value: integer
  * default: 10
  * description: set the button position

#### [wpt]

* enable:
  * required: false
  * value: 0/1, false/true
  * default: false
  * description:  if enable, the app will connect to WPT

* path:
  * required: false
  * value: string (path of WPT folder, index.js or bash/batch)
  * default: null
  * description:  if set the app will create a new process and launch WPT (if the port is already taken it will try to kill the active process before)

  * examples:

    /home/<User/nodejs/wyndpostools/bashs/start.sh
    /home/<User/nodejs/wyndpostools/
    /home/<User/nodejs/wyndpostools/index.js

* url:
  * required: false
  * value: string (url)
  * default: <http://localhost:9963>
  * description: url of wpt to connect. Modify it if url has changed

* wait_on_ipc:
  * required: false
  * value: 0/1, false/true
  * default: 1
  * description: To know if wpt is ready, the app wait an ipc signal, if set to false, it will check the stdout of process instead

  * note

   true: .batch, .sh, .js
   false: .js

* keep_listeners:
  * required: false
  * value: 0/1 false/true
  * default: false
  * description: keep listeners on output of wpt process (fix windows crash)

* shell:
  * required: false
  * value: 0/1 false/true
  * default: false
  * description: wpt process will run in another shell

* detached:
  * required: false
  * value: 0/1 false/true
  * default: false
  * description: wpt process will run in a detached process

* cwd:
  * required: false
  * value: string (path)
  * default: null
  * description: add node exe to run the process (only work if wpt.path is set)

* connection_timeout:

  * required: false
  * value: integer
  * default: 10
  * description: set the timeout for the connection with wpt

* creation_timeout:

  * required: false
  * value: integer
  * default: 30
  * description: set the timeout for the creation of wpt process

#### [http]

* enable:
  * required: false
  * value: 0/1, false/true
  * default: false
  * description: launch intern http server. For proxy usage and API rest request

   <http://localhost:{port}/update/lastest>

* port:

  * required: false
  * value: integer
  * default: null
  * description: set the port to inner http

#### [proxy]

* enable:
  * required: false
  * value: 0/1, false/true
  * default: false
  * description: set proxy in chromium session and in http server if used

* url:
  * required: false
  * value: string (url)
  * default: <http://localhost:9963>
  * description: url of proxy to connect.

#### [update]

* enable:
  * required: false
  * value: 0/1, false/true
  * default: false
  * description: allow update functionnality with [socket] or [http]

* on_start:
  * required: false
  * value: 0/1, false/true
  * default: false
  * description: check update at the launch of the app

#### [log]

* main:
  * required: false
  * value: info, debug, error
  * default: false
  * description: set level of the main log process

* renderer:
  * required: false
  * value: info, debug, error
  * default: false
  * description: set level of the renderer log process

* app:
  * required: false
  * value: info, debug, error
  * default: false
  * description: set level of the app log. If the app is in iframe mode. It can send the log to store

#### [central]

* enable:
  * required: false
  * value: 0/1, false/true
  * default: false
  * description: allow register to central

* mode:
  * required: false
  * value: AUTO,MANUAL
  * default: AUTO
  * description: if mode auto, the eletron-launcher will register itself. If manual, the app have to send message through parent IPS

 ```javascript

 if (parent) {
 const message = JSON.stringify({
     type: "LOG",
     level: 'INFO',
     payload: "message to send"
    })
 parent.postMessage(message, '*')
 }

 ```

* log

  * required: false
  * value: info, debug, error
  * default: error
  * description: send log to the central ( filter by log level)

#### [zoom]

* level
  * required: false
  * value: integer
  * default: 1
  * description:  if set, it will set the zoom level of the browser (for issue: zoom  is saved by the browser)

* factor
  * required: false
  * value: integer
  * default: 0.99
  * description: if set, it will set the zoom level factor of the browser (for issue: zoom  is saved by the browser)

#### [report]

* enable:
  * required: false
  * value: 0/1, false/true
  * default: false
  * description: add report menu for X/Z reprt

#### [emergency]

* enable:
  * required: false
  * value: 0/1, false/true
  * default: false
  * description: add emergency button

#### [commandline]

* required: false
* description: list of commandline to set (see: <https://www.electronjs.org/docs/latest/api/command-line-switches>)

#### [publish]

* provider:
  * required: true
  * value: github, generic, custom
  * default: github
  * description: add publisher provider

* url:
  * required: true
  * value: github, generic, custom
  * default: github
  * description: add publisher url (depend on provider)

#### [theme]

* required: false
* values : hex (without # character at the begining)
* description: can change the color
* list

   "primary-color",
   "secondary-color",
   "danger-color",
   "success-color",
   "warning-color",
   "description-color",
   "disable-color",
   "border-color",
   "primary-color-hover",
   "secondary-color-hover",
   "danger-color-hover",
   "primary-color-background",
   "secondary-color-background",
   "danger-color-background",
   "success-color-background",
   "warning-color-background",
   "text-color",
   "text-color-inv",
   "disable-background",
   "background-hover",
   "background-selected",
   "table-head-text-color",
   "table-head-background",
   "table-head-background-hover",
   "table-head-background-selected",
   "table-head-background-selected-hover",
   "menu-background",
   "submenu-background",
   "menu-text-color",
   "box-shadow-color"

* examples

   [theme]
   primary-color = 474747
   menu-background = 474747

### Removed properties

#### [socket]

* enable:
  * required: false
  * value: 0/1, false/true
  * default: false
  * description: allow message from wpt (and from central)
  * note : wpt must be enable

     @wel/update
     @wel/reload
     @wel/notification

### example

  url = <http://localhost:7000/>
  screen = 0
  raw = 0

  [wpt]
  enable = 1
  path = /home/toto/nodejs/wyndpostools

  [zoom]
  level = 1
  factor = 0.99

  [menu]
  enable = 1
  email = support@wynd.eu
  phone_number = +33 (0)1.76.44.03.53
  password = 1111

  [emergency]
  enable = 0

  [update]
  enable = 1
  on_start = 1

  [central]
  enable = 0
  mode = AUTO
  log = error

  [http]
  enable = 1
  port = 7000

  [report]
  enable = 1

  [log]
  main = info
  renderer = info
  app = info

  [theme]
  primary-color = 474747
  menu-background = 474747

## url mode

 Serveur http | container | url | dossier externe | dossier local
--------------|-----------|------|---|---|
ON | static | proxy | iframe/file(1) | iframe/file(1)
OFF | file | url | iframe/file(1) | iframe/file(1)

(1): Depend if the container is activate/desactivate (see raw property)
 container | dossier externe | dossier local
--------------|-----------|---|
ON  | iframe | iframe
OFF | file | file

## Update

### auto update

* config pre-requis

  [update]
  enable = 1
  on_start = 1

 if update.on_start is set, the application will check update when starting the application

### By http

* prerequisite config

  [update]
  enable = 1
  [http]
  enable = 1
  port = 7000

 you can ask for an update by requesting the route <http://localhost:{port}/update/latest>

### By socket

* prerequisite config

  [update]
  enable = 1
  [wpt]
  enable = 1
  [central]
  enable = 1

* with CDM

  job url socket://{APP}/update

## App functionality

### Log

description: Only work if conf.raw = 0
An app can send log to be store in #APP_DATA#/electron-launcher/logs/app.log

```javascript
if (parent) {
 const message = JSON.stringify({
   type: "LOG",
   level: 'INFO', // DEBUG, INFO, ERROR
   payload: 'message to log'
 })
 parent.postMessage(message, '*')
}
```
