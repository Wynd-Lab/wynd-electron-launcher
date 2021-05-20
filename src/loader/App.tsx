import React, { useEffect, useRef, useState } from 'react'

import { ipcRenderer } from "electron"
import { Layout, Tooltip } from 'antd'

import './App.less'
import { EAction, EActionKeys, EStatus, EStatusKeys, IStore } from './interface'
import { getTotal } from './helpers/get_total'
import { Progress } from 'antd';

export interface IAppProps {
}
export interface IAppState { }
const App: React.FunctionComponent<IAppProps> = () => {

	const [appState, setAppState] = useState<IStore>({
		action: EAction.initialize,
		current: 0,
		total: 0,
		status: EStatus.start_wyndpos,
		version: ""
	})

	const appRef = useRef<IStore>(appState)

	useEffect(() => {
		ipcRenderer.on('current_status', (event, status : EStatusKeys) => {
			const current = status.indexOf("_skip") > 0 || status.indexOf("_done") > 0  ? appRef.current.current + 1 : appRef.current.current
			setAppState({
				...appRef.current,
				current: current,
				status: EStatus[status],
			})
		})
		ipcRenderer.on('app_version', (event, action) => {
			setAppState({
				...appRef.current,
				version: action
			})
		})
		ipcRenderer.on('loader_action', (event, action: EActionKeys) => {
			setAppState({
				...appRef.current,
				current: 0,
				total: getTotal(action),
				action: EAction[action]
			})
		})

	}, [])
	appRef.current = appState

	const value = Math.round(Number(appState.current * 100 / appState.total))
	return (
		<Layout id="wyndpos-loader">
			<div className="wyndpos-loader-container">
				<div className="loader-header">
					<span className="loader-action">{appState.action}</span>
					<Tooltip title={`${appState.current} / ${appState.total}`}>
						<Progress className="loader-action-progress" size="small" showInfo={false} percent={value} steps={8} />
					</Tooltip>
				</div>
				<div className="loader-content">
					<div className="loader-status">
						{appState.status}
					</div>
				</div>
				<div className="loader-footer">
					<span className="loader-version">v{appState.version}</span>
				</div>
			</div>
		</Layout>
	)
}

export default App
