import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'

import { Modal, notification } from 'antd'

import { Theme, TThemeColorTypes } from 'react-antd-cssvars'

import { ipcRenderer } from 'electron'

import { ICustomWindow } from '../helpers/interface'
import computeTheme from '../helpers/compute_theme'

import { store } from './store'

import App from './App'

import './index.less'
import {
	setConfigAction,
	setWPTInfosAction,
	setScreensAction,
	setWPTPluginsAction,
	setUserIdAction,
	TNextAction,
	wptConnectAction,
	iFrameReadyAction,
	iFrameDisplayAction,
	setAskAction,
	openPinpadAction,
	setAppInfos
} from './store/actions'

import Plugins from './components/Plugins'
import { IAppInfo } from './interface'

const { info } = Modal

declare let window: ICustomWindow

window.store = store
window.theme = new Theme<TThemeColorTypes>(undefined, computeTheme)

// if (window.hooks) {
// 	window.hooks.hello("Hello from react")
// }
const receiveMessage = (event: any) => {
	if (event.data && event.data) {
		try {
			const data = JSON.parse(event.data)
			if (data.type && typeof data.type === 'string') {
				console.log(data.type, data.type.toUpperCase())

				switch (data.type.toUpperCase()) {
					case "LOG":
						console.log('child.action', "log", data.level || 'INFO', data.payload)
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
		case TNextAction.WPT_STATUS:
			const state = store.getState()
			if (state.display.ready) {
				store.dispatch(iFrameDisplayAction(state.display.switch === "CONTAINER" ? "WPT" : "CONTAINER"))
			}
			break
		case TNextAction.OPEN_DEV_TOOLS:
			ipcRenderer.send('main_action', 'open_dev_tools')
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
	document.getElementById('root'),
)

// win.fullscreen = true

// process.on('SIGTERM', () => {
// 	closeApp(win, child)
// })
