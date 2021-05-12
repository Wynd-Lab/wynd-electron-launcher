import React, {useEffect, useState} from 'react'

import {ipcRenderer} from "electron"
import { Layout } from 'antd'

import './App.less'
import { IStore } from './interface'

export interface IAppProps {
}
export interface IAppState {}
const App: React.FunctionComponent<IAppProps> = () => {

	const [appState, setAppState] = useState<IStore>({
		status: "Start Wynpos"
	})
	useEffect(() => {
		ipcRenderer.on('current_action', (event, action) => {
			console.log('current_action', action)
			setAppState({
				status: action
			})
		})

	}, [])


	return (
		<Layout id="wyndpos-loader">
			<div>
				{appState.status}
			</div>
		</Layout>
	)
}

export default App
