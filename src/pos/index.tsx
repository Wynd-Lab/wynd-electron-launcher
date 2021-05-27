import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'

import { Modal } from 'antd'

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
	TNextAction,
	wptConnectAction,
	iFrameReadyAction,
	iFrameDisplayAction
} from './store/actions'

import Plugins from './components/Plugins'

const { info } = Modal

declare let window: ICustomWindow

window.store = store
window.theme = new Theme(undefined, computeTheme)

const receiveMessage = (event: any) => {
	if (event.data && event.data.userId) {
		store.dispatch(setUserIdAction(Number.parseInt(event.data.userId, 10)))
	}
}

ipcRenderer.on('request_wpt.error', (event, data) => {
	console.log(data)
})

ipcRenderer.on('request_wpt.done', (event, action, data) => {

	switch (action) {
		case 'plugins':

			const state = store.getState()

			store.dispatch(setWPTPluginsAction(data))
			console.log(action, state.display.ready)
			if(state.display.ready) {

				const modal = info({
					className: 'modal-plugins',
					title: 'Activate plugins',
					icon: null,
					autoFocusButton: null,
					centered: true,
					content:(
						<Plugins plugins={data}/>
					)
					,
					onOk: () => {
						modal.destroy()
					},
				})
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
})

ipcRenderer.on('screens', (event, screens) => {
	store.dispatch(setScreensAction(screens))
})

ipcRenderer.on('ready', (event, display) => {
	store.dispatch(iFrameReadyAction(display))
})

ipcRenderer.on('wpt_connect', (event, connected) => {
	store.dispatch(wptConnectAction(connected))
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
			ipcRenderer.send('main_action', 'emergency')
			break
		case TNextAction.CLOSE:
			ipcRenderer.send('main_action', 'close')
			break
		case TNextAction.RELOAD:
			ipcRenderer.send('main_action', 'reload')
			break
		case TNextAction.WPT_PLUGINS:
			// ipcRenderer.send('main_action', 'plugins')
			ipcRenderer.send('request_wpt', 'plugins')
			break
		case TNextAction.WPT_STATUS:
			const state = store.getState()
			if (state.display.ready) {

				store.dispatch(iFrameDisplayAction(state.display.switch === "POS" ?"WPT" : "POS"))
			}
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
