import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'

import { Modal, notification } from 'antd'

import axios from 'axios'

import { Theme, TThemeColorTypes } from 'react-antd-cssvars'

import { ipcRenderer, webFrame } from 'electron'

import { ICustomWindow } from '../helpers/interface'
import computeTheme from '../helpers/compute_theme'
import { generateDates } from './helpers/generate'

import { store } from './store'

import App from './App'

import {
  setConfigAction,
  setWPTInfosAction,
  setScreensAction,
  setWPTPluginsAction,
  TNextAction,
  wptConnectAction,
  iFrameReadyAction,
  iFrameDisplayAction,
  setAskAction,
  openPinpadAction,
  setAppInfos,
  setReportEnvInfo,
  setToken,
  setReportDates,
  closeMenuAction,
  setLoader,
} from './store/actions'

import Plugins from './components/Plugins'
import { IAppInfo, IEnvInfo } from './interface'

import './styles/index.less'
import { setReportMaLineSizeAction } from './store/actions/report'

const { info } = Modal

declare let window: ICustomWindow

window.store = store
window.theme = new Theme<TThemeColorTypes>(undefined, computeTheme(store))
window.theme.set('primary-color', window.theme.get('menu-background'), true)

const receiveMessage = (event: any) => {
  if (event.data && event.data && typeof event.data === 'string') {
    try {
      const data = JSON.parse(event.data)
      if (data.type && typeof data.type === 'string') {
        switch (data.type.toUpperCase()) {
          case 'LOG':
            ipcRenderer.send(
              'child.action',
              'log',
              data.level || 'INFO',
              data.payload
            )
            break

					case 'CENTRAL.REGISTER':
						ipcRenderer.send(
							'child.action',
							'central.register',
							data.payload
						)
						break
          default:
            break
        }
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e)
    }
    // 	store.dispatch(setUserIdAction(Number.parseInt(event.data.userId, 10)))
  }
}

window.main?.receive('request_wpt.error', (action: string, err: any) => {
	notification.open({
    message: err.code,
		type: 'error',
    description: err.message,
    duration: 3,
  })
	store.dispatch(setAskAction(false))
})
// eslint-disable-next-line @typescript-eslint/no-unused-vars
ipcRenderer.on('request_wpt.error', (_event, action, err) => {
	notification.open({
    message: err.code,
		type: 'error',
    description: err.message,
    duration: 3,
  })

	store.dispatch(setAskAction(false))
})

ipcRenderer.on('app_infos', (event, appInfos: IAppInfo) => {
  store.dispatch(setAppInfos(appInfos))
})

ipcRenderer.on('request_wpt.done', (event, action, data) => {
	store.dispatch(setAskAction(false))
  switch (action) {
    case 'plugins':
      const state = store.getState()

      store.dispatch(setWPTPluginsAction(data))
      if (state.wpt.ask) {
        const modal = info({
          className: 'modal-plugins',
          title: 'Activate plugins',
          icon: null,
          autoFocusButton: null,
          centered: true,
          content: <Plugins plugins={data} />,
          onOk: () => {
            modal.destroy()
          },
        })
      }
      break
    case 'infos':
      store.dispatch(setWPTInfosAction(data))
      break
		case 'fastprinter.defaultprinterdata':
			store.dispatch(setReportMaLineSizeAction(data.maxlinesize))
			break
    default:
      break
  }
})

ipcRenderer.on('conf', (event, conf) => {

	if (conf && conf.log && conf.log.renderer) {
		window.log.transports.file.level = conf.log.renderer
		window.log.transports.console.level = conf.log.renderer
	}

  store.dispatch(setConfigAction(conf))
  if (conf.theme) {
    for (const themeKey in conf.theme) {
      if (window.theme.has(themeKey as TThemeColorTypes)) {
        const colorTheme = conf.theme[themeKey]
        window.theme.set(themeKey as TThemeColorTypes, `#${colorTheme}`, true)
      }
    }
  }

  if (conf.zoom && webFrame) {
    if (conf.zoom.level) {
      webFrame.setZoomLevel(conf.zoom.level)
    }
    if (conf.zoom.factor) {
      webFrame.setZoomFactor(conf.zoom.factor)
    }
  }
})

ipcRenderer.on('screens', (event, screens) => {
  store.dispatch(setScreensAction(screens))
})

ipcRenderer.on('ready', (event, ready) => {
  store.dispatch(iFrameReadyAction(ready))
})

ipcRenderer.on('wpt_connect', (event, connected) => {
  store.dispatch(wptConnectAction(connected))
})

// eslint-disable-next-line @typescript-eslint/no-unused-vars
ipcRenderer.on('ask_password', (event, connected) => {
  store.dispatch(openPinpadAction(TNextAction.OPEN_DEV_TOOLS))
})

ipcRenderer.on('notification', (event, notif) => {
  notification.open({
    message: notif.header,
    description: notif.message,
    duration: 3,
  })
})

ipcRenderer.on('menu.action', (event, action) => {
  if (action) {
    const conf = store.getState().conf
    const display = store.getState().display
    if (
      conf &&
      conf.menu &&
      conf.menu.password &&
      display.switch === 'CONTAINER'
    ) {
      store.dispatch(openPinpadAction(action))
    } else {
      onCallback(action)
    }
  }
})
// window.main?.send('ready', 'main')

ipcRenderer.send('ready', 'main')
window.addEventListener('message', receiveMessage, false)

// const win = getWindow()

// const screens = getScreens()
// store.dispatch(setScreensAction(screens))

// clearCache()

const onCallback = (action: TNextAction, ...data: any) => {
  const state = store.getState()
  switch (action) {
    case TNextAction.EMERGENCY:
      ipcRenderer.send('main.action', 'emergency')
      break
    case TNextAction.CLOSE:
      ipcRenderer.send('main.action', 'close')
      break
    case TNextAction.RELOAD:
      store.dispatch(iFrameReadyAction(false))
      ipcRenderer.send('main.action', 'reload')
      break
    case TNextAction.REQUEST_WPT:
      store.dispatch(setAskAction(true))
      // ipcRenderer.send('main_action', 'plugins')
			if (data && data.length > 0) {
				const keyMessage: string = data.shift()
				ipcRenderer.send('request_wpt', keyMessage, ...data)
			}
      break
    case TNextAction.REPORT:
      const api_key = Object.keys(sessionStorage).find((key) => {
        return key.indexOf('StorageCache_') === 0
      })

      if (api_key) {
        let token = sessionStorage.getItem(api_key)
        if (typeof token === 'string') {
          token = JSON.parse(token)
        }
        if (Array.isArray(token)) {
          token = token[0]
        }
        const urlParsed = api_key.substring('StorageCache_'.length)
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const url = new URL(urlParsed)

        if (token) {
          store.dispatch(setToken(token))
        }

        store.dispatch(setLoader(true))
				ipcRenderer.send('request_wpt', 'fastprinter.defaultprinterdata')
        axios
          .get<IEnvInfo>(`http://localhost:${state.conf?.http.port}/env.json`)
          .then((response) => {
            store.dispatch(setReportEnvInfo(response.data as IEnvInfo))

						const [startDate, endDate] = generateDates()

            store.dispatch(setReportDates(startDate, endDate))

            if (state.display.ready) {
              store.dispatch(iFrameDisplayAction('REPORT'))
              store.dispatch(closeMenuAction())
            }
          })
          .catch((err) => {
            notification.open({
              message: err.message,
              description: err.message,
              duration: 3,
            })
          })
          .finally(() => {
            store.dispatch(setLoader(false))
          })
      } else {
        notification.open({
          message: 'API_KEY_NOT_FOUND',
          description: 'api key not found',
          duration: 3,
        })
      }

      break
    case TNextAction.WPT_STATUS:
      if (state.display.ready) {
        store.dispatch(
          iFrameDisplayAction(
            state.display.switch === 'CONTAINER' ? 'WPT' : 'CONTAINER'
          )
        )
      }
      break
    case TNextAction.OPEN_DEV_TOOLS:
      ipcRenderer.send('main.action', 'open_dev_tools')
      break
    default:
      break
  }
}

ReactDOM.render(
  <React.Fragment>
    <Provider store={store}>
			<App onCallback={onCallback} />
    </Provider>
  </React.Fragment>,
  document.getElementById('electron-launcher-root')
)

// win.fullscreen = true

// process.on('SIGTERM', () => {
// 	closeApp(win, child)
// })
