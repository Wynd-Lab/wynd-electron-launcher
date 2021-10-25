import React, { useEffect, useRef, useState } from 'react'

import { ipcRenderer } from 'electron'
import { Layout, Tooltip, Progress } from 'antd'

import './App.less'
import {
  EAction,
  EActionKeys,
  EStatus,
  EStatusKeys,
  IStore,
} from './interface'
import { getTotal } from './helpers/get_total'

export interface IAppProps {}
export interface IAppState {}
const App: React.FunctionComponent<IAppProps> = () => {
  const [appState, setAppState] = useState<IStore>({
    action: EAction.initialize,
    current: 0,
    total: getTotal('initialize'),
    status: EStatus.start_app,
    name: '',
    version: '',
    download: false,
    progress: 0,
  })

  const appRef = useRef<IStore>(appState)

  useEffect(() => {
    ipcRenderer.on(
      'current_status',
      (event, status: EStatusKeys, data: any) => {
        const newState: IStore = {
          ...appRef.current,
          status: EStatus[status],
        }

        if (status === 'get_wpt_pid' && data) {
          newState.status = newState.status + ' ' + data
        }

        if (status === 'check_update_skip' && data) {
          newState.status = data.message
        }

        const current =
          status.indexOf('_skip') > 0 || status.indexOf('_done') > 0
            ? appRef.current.current + 1
            : appRef.current.current

        newState.current = current
        if (status === 'download_update') {
          newState.download = true
          newState.progress = 0
        }

        if (
          (process.env.NODE_ENV === 'development' ) ||
          process.env.DEV === 'LOADER'
        ) {

					if (!EStatus[status]) {
						// eslint-disable-next-line no-console
						console.warn(
							status,
							EStatus[status],
							newState.current,
							newState.total
						)
					} else {
						// eslint-disable-next-line no-console
						console.info(
							status,
							EStatus[status],
							newState.current,
							newState.total
						)
					}
        }
        // if(status === "download_update_done") {
        // 	newState.download = false
        // 	newState.progress = 0
        // }

        setAppState(newState)
      }
    )

    ipcRenderer.on('download_progress', (event, action) => {
      setAppState({
        ...appRef.current,
        progress: action,
      })
    })

    ipcRenderer.on('app_infos', (event, action) => {
      setAppState({
        ...appRef.current,
        ...action,
      })
    })

    ipcRenderer.on('loader.action', (event, action: EActionKeys) => {
      setAppState({
        ...appRef.current,
        current: 0,
        total: getTotal(action),
        action: EAction[action],
      })
    })

    ipcRenderer.on('error', (event, data) => {
      setAppState({
        ...appRef.current,
        status: data.message,
      })
    })
  }, [])

  appRef.current = appState

  const value = Math.round(Number((appState.current * 100) / appState.total))
  return (
    <Layout id="e-launcher-loader">
      <div className="loader-container">
        <div className="loader-header">
          <span className="loader-action">{appState.action}</span>
          <Tooltip title={`${appState.current} / ${appState.total}`}>
            <Progress
              className="loader-action-progress"
              size="small"
              showInfo={false}
              percent={value}
              steps={8}
            />
          </Tooltip>
        </div>
        <div className="loader-content">
          <div className="loader-status">{appState.status}</div>
          {appState.download && (
            <Progress
              percent={appState.progress}
              status="active"
              showInfo={false}
            />
          )}
        </div>
        <div className="loader-footer">
          <span className="loader-app-name">{appState.name}</span>
          <span className="loader-version">v{appState.version}</span>
        </div>
      </div>
    </Layout>
  )
}

export default App
