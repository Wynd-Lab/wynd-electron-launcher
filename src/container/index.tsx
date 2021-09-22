import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'

import { Modal, notification } from 'antd'

import  axios from 'axios'

import { Theme, TThemeColorTypes } from 'react-antd-cssvars'

import { ipcRenderer, webFrame } from 'electron'

import { ICustomWindow } from '../helpers/interface'
import computeTheme from '../helpers/compute_theme'

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
} from './store/actions'

import Plugins from './components/Plugins'
import { IAppInfo, IEnvInfo } from './interface'

import './styles/index.less'

const { info } = Modal

declare let window: ICustomWindow

window.store = store
window.theme = new Theme<TThemeColorTypes>(undefined, computeTheme)

const receiveMessage = (event: any) => {
	if (event.data && event.data && typeof event.data === "string") {
		try {
			const data = JSON.parse(event.data)
			if (data.type && typeof data.type === 'string') {
				switch (data.type.toUpperCase()) {
					case "LOG":
						ipcRenderer.send('child.action', "log", data.level || 'INFO', data.payload)
						break;

					default:
						break;
				}
			}
		} catch(e) {
			console.error(e)
		}
	// 	store.dispatch(setUserIdAction(Number.parseInt(event.data.userId, 10)))
	}
}

ipcRenderer.on('request_wpt.error', (event, data) => {
})

ipcRenderer.on('app_infos', (event, appInfos: IAppInfo) => {
	store.dispatch(setAppInfos(appInfos))

})

ipcRenderer.on('request_wpt.done', (event, action, data) => {

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
					content: (
						<Plugins plugins={data} />
					)
					,
					onOk: () => {
						modal.destroy()
					},
				})
				store.dispatch(setAskAction(false))
			}
			break;
		case 'infos':
			store.dispatch(setWPTInfosAction(data))
			break;

		default:
			break;
	}
})

ipcRenderer.on('conf', (event, conf) => {
	store.dispatch(setConfigAction(conf))
	if (conf.theme) {
		for (const themeKey in conf.theme) {
			if (window.theme.has(themeKey as TThemeColorTypes)) {
				const colorTheme = conf.theme[themeKey];
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


ipcRenderer.on('ask_password', (event, connected) => {
	store.dispatch(openPinpadAction(TNextAction.OPEN_DEV_TOOLS))
})

ipcRenderer.on('notification', (event, notif) => {

	notification.open({
		message: notif.header,
		description: notif.message,
		duration: 3
	})

})

ipcRenderer.on('menu.action', (event , action) => {
	if (action) {
		const conf = store.getState().conf
		const display = store.getState().display
		if (conf && conf.menu && conf.menu.password && display.switch === "CONTAINER") {
			store.dispatch(openPinpadAction(action))
		} else {
			onCallback(action)
		}
	}
})

ipcRenderer.send('ready', 'main')
window.addEventListener('message', receiveMessage, false)

// const win = getWindow()

// const screens = getScreens()
// store.dispatch(setScreensAction(screens))

// clearCache()

const onCallback = (action: TNextAction) => {
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
		case TNextAction.WPT_PLUGINS:
			store.dispatch(setAskAction(true))
			// ipcRenderer.send('main_action', 'plugins')
			ipcRenderer.send('request_wpt', 'plugins')
			break
		case TNextAction.REPORT:
			const api_key = Object.keys(sessionStorage).find((key) => {
				return key.indexOf("StorageCache_https://api") === 0
			})

			if (api_key) {
				let token = sessionStorage.getItem(api_key)
				if (typeof token === "string") {
					token = JSON.parse(token)
				}
				if (Array.isArray(token)) {
					token = token[0]
				}
				const urlParsed = api_key.substring('StorageCache_'.length)
				const url = new URL(urlParsed)
				console.log(url)

				if (token) {
					store.dispatch(setToken(token))
				}
				axios.get<IEnvInfo>('http://localhost:7000/env.json').then((response) => {
					console.log(response.data)

					store.dispatch(setReportEnvInfo(response.data as IEnvInfo))



					const date = new Date();
					const day = String(date.getDay()).padStart(2, "0")
					const month = String(date.getUTCMonth() + 1).padStart(2, "0")//months from 1-12
					const year = date.getUTCFullYear();

					const startDate = `${year}-${month}-01`
					const endDate = `${year}-${month}-${day}`

					store.dispatch(setReportDates(startDate, endDate))

					console.log(state)
					if (state.display.ready) {
						store.dispatch(iFrameDisplayAction('REPORT'))
					}
					// return axios.get(`${response.data.API_URL}/pos/reports/report_z/${response.data.API_CENTRAL_ENTITY}?month=${newDate}`, {headers}).then((response) => {
					// 	store.dispatch(setReportData(response.data))

					// })

				})
				.catch((err) => {
					notification.open({
						message: err.message,
						description: err.message,
						duration: 3
					})
				})
			} else {
				notification.open({
					message: "API_KEY_NOT_FOUND",
					description: "api key not found",
					duration: 3
				})
			}

			break
		case TNextAction.WPT_STATUS:
			if (state.display.ready) {
				store.dispatch(iFrameDisplayAction(state.display.switch === "CONTAINER" ? "WPT" : "CONTAINER"))
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
	document.getElementById('electron-launcher-root'),
)

// win.fullscreen = true

// process.on('SIGTERM', () => {
// 	closeApp(win, child)
// })
