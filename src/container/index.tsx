import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'

import { Modal, notification } from 'antd'

import axios from 'axios'

import { Button, Theme, TThemeColorTypes } from 'react-antd-cssvars'

import { ipcRenderer, webFrame, WebContents } from 'electron'

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
  setLoader,
	setToggleMenu,
} from './store/actions'

import Plugins from './components/Plugins'
import { IAppInfo, IEnvInfo, IRootState } from './interface'

import './styles/index.less'
import { setReportMaLineSizeAction } from './store/actions/report'

const { info, confirm } = Modal

declare let window: ICustomWindow

window.store = store
window.theme = new Theme<TThemeColorTypes>(undefined, computeTheme(store))
window.theme.set('primary-color', window.theme.get('menu-background'), true)

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

	const state = store.getState()

  switch (action) {
    case 'plugins':
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
	if (state.wpt.ask) {
		store.dispatch(setAskAction(false))
	}
})

ipcRenderer.on('conf', (event, conf) => {
	if (conf && conf.log && conf.log.renderer) {
		window.log.level = conf.log.renderer
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

	if (conf.menu) {
		const menuButton = document.getElementById('menu-button')
		if (menuButton && conf.menu.button_size) {
			menuButton.style.width=`${conf.menu.button_size}px`
			menuButton.style.height=`${conf.menu.button_size}px`
		}

		if (menuButton && conf.menu.button_position) {
			menuButton.style.bottom=`${conf.menu.button_position}px`
			menuButton.style.left=`${conf.menu.button_position}px`
		}
	}
})


ipcRenderer.on('toggle_menu', (event, toggle) => {
  store.dispatch(setToggleMenu(toggle))
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
ipcRenderer.on('ask_password', (event, action, action2) => {

  const state: IRootState = store.getState()
  if (state.menu.open) {
		store.dispatch(setToggleMenu(false))
	}
  if (state.conf?.menu.password) {
    store.dispatch(openPinpadAction(TNextAction.OPEN_DEV_TOOLS, state.conf?.menu.password))
  } else if (action === 'open_dev_tools' && state.conf?.view === 'webview') {
		let count = 0
		let webview: WebContents | null = document.getElementById('e-launcher-frame') as unknown as WebContents
		if (webview) {

			webview.openDevTools()
		} else {

			const interval = setInterval(() => {
				count++
				webview = document.getElementById('e-launcher-frame') as unknown as WebContents
				if (webview) {
					clearInterval(interval)
					webview.openDevTools()
				}
				if (count > 10) {
					clearInterval(interval)
				}

			}, 500)
		}

  }
})

ipcRenderer.on('notification', (event, notif) => {
	if (typeof notif === 'string') {
		notification.open({
			message: notif,
			duration: 3,
		})
	} else if (typeof notif === 'object') {

		if (notif.confirm) {
			const key = `open${Date.now()}`

			notification.open({
				className: 'notification-ask',
				type: notif.type,
				message: notif.header,
				description: notif.message,
				closeIcon: (<div></div>),
				duration: 60,
				key,
				btn: (
						<React.Fragment>
							<Button type="primary" size="small" onClick={() => { onCallback(TNextAction.NOTIFICATION, true); notification.close(key) }}>
								YES
							</Button>
							<Button type="primary" size="small" onClick={() => { onCallback(TNextAction.NOTIFICATION, false); notification.close(key) }}>
								NO
							</Button>
						</React.Fragment>
				),
				onClose: () => {
					onCallback(TNextAction.NOTIFICATION, false)
				}
			})
		} else {
			notification.open({
				type: notif.type,
				message: notif.header,
				description: notif.message,
				duration: 3,
			})
		}

	}
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
      store.dispatch(openPinpadAction(action, conf.menu.password))
    } else {
      onCallback(action)
    }
  }
})

ipcRenderer.send('ready', 'main')

const sendChildAction = (event: string, ...data: any) => {
	ipcRenderer.send('child.action', event, ...data )
}

const reloadAndClearCache = (clearSession: boolean) => {
	if (clearSession) {
		localStorage.clear()
		sessionStorage.clear()
	}
	ipcRenderer.send('main.action', 'reload', clearSession)
}

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

			const modal = confirm({
				// className: 'emergency-modal',
				title: 'reload the application',
				mask: true,
				content: 'Do you want to clear the cache ?',
				centered: true,
				okText: 'YES',
				cancelButtonProps: {
					type: 'link',
				},
				cancelText: 'NO',
				onOk() {
					modal.destroy()
					window.log.info('[WINDOW CONTAINER] Click emergency OK')
					store.dispatch(iFrameReadyAction(false))
					reloadAndClearCache(true)
				},
				onCancel() {
					modal.destroy()
					window.log.info('[WINDOW CONTAINER] Click emergency Cancel')
					store.dispatch(iFrameReadyAction(false))
					reloadAndClearCache(false)
				},
			})

      break
		case TNextAction.NOTIFICATION:
			ipcRenderer.send('main.action', 'notification', data[0])
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
              store.dispatch(setToggleMenu(false))
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

ipcRenderer.on('ask_reload', (event, cleaCache: boolean) => {
	reloadAndClearCache(cleaCache)
})

const root = ReactDOM.createRoot(document.getElementById('electron-launcher-root') as HTMLElement)

root.render(
  <React.Fragment>
    <Provider store={store}>
			<App onCallback={onCallback} sendChildAction={sendChildAction}/>
    </Provider>
  </React.Fragment>
)

// win.fullscreen = true

// process.on('SIGTERM', () => {
// 	closeApp(win, child)
// })
