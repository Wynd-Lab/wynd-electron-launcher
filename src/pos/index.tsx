import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'

import { Theme } from 'react-antd-cssvars'

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
	TNextPinpadAction,
	wptConnectAction,
} from './store/actions'

declare let window: ICustomWindow

window.store = store
window.theme = new Theme(undefined, computeTheme)

const receiveMessage = (event: any) => {
	if (event.data && event.data.userId) {
		store.dispatch(setUserIdAction(Number.parseInt(event.data.userId, 10)))
	}
}

ipcRenderer.on('conf', (event, conf) => {
	store.dispatch(setConfigAction(conf))
})

ipcRenderer.on('screens', (event, screens) => {
	store.dispatch(setScreensAction(screens))
})

ipcRenderer.on('wpt_infos', (event, infos) => {
	store.dispatch(setWPTInfosAction(infos))
})
ipcRenderer.on('wpt_connect', (event, connected) => {
	store.dispatch(wptConnectAction(connected))
})
ipcRenderer.on('wpt_plugins', (event, plugins) => {
	store.dispatch(setWPTPluginsAction(plugins))
})

ipcRenderer.send('ready', 'main')
window.addEventListener('message', receiveMessage, false)
// const win = getWindow()

// const screens = getScreens()
// store.dispatch(setScreensAction(screens))

// clearCache()

const onCallback = (action: TNextPinpadAction) => {
	// clearCache()
	switch (action) {
		case TNextPinpadAction.CLOSE:
			ipcRenderer.send('main_action', 'close')
			break
		case TNextPinpadAction.RELOAD:
			ipcRenderer.send('main_action', 'reload')
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
