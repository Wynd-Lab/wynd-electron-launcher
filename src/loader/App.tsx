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
				status.indexOf('_skip') > 0 || status.indexOf('_done') > 0 || status === 'finish'
				? newState.current + 1
				: newState.current

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
							newState.status,
							EStatus[status],
							newState.current,
							newState.total
						)
					} else {
						// eslint-disable-next-line no-console
						console.info(
							status,
							newState.status,
							EStatus[status],
							newState.current,
							newState.total
						)
					}
        }

				appRef.current = newState
				if (newState.status) {
					setAppState(newState)
				}
      }
    )

    ipcRenderer.on('download_progress', (event, action) => {
      appRef.current = {
        ...appRef.current,
        progress: action,
      }
    })

    ipcRenderer.on('app_infos', (event, action) => {
			appRef.current = {
        ...appRef.current,
        ...action,
      }
    })

    ipcRenderer.on('loader.action', (event, action: EActionKeys) => {
      appRef.current = {
        ...appRef.current,
        current: 0,
        total: getTotal(action),
        action: EAction[action],
      }
    })

    ipcRenderer.on('error', (event, data) => {
			appRef.current = {
        ...appRef.current,
        status: data.message,
      }
    })
  }, [])

  const value = Math.round(Number(( appRef.current.current * 100) /  appRef.current.total))
  return (
    <Layout id="e-launcher-loader">
      <div className="loader-container">
        <div className="loader-header">
          <span className="loader-action">{ appRef.current.action}</span>
          <Tooltip title={`${ appRef.current.current} / ${ appRef.current.total}`}>
            <Progress
              className="loader-action-progress"
              size="small"
              showInfo={false}
              percent={value}
              steps={9}
            />
          </Tooltip>
        </div>
        <div className="loader-content">
          <div className="loader-status">{ appRef.current.status}</div>
          { appRef.current.download && (
            <Progress
              percent={ appRef.current.progress}
              status="active"
              showInfo={false}
            />
          )}
        </div>
        <div className="loader-footer">
          <span className="loader-app-name">{ appRef.current.name}</span>
          <span className="loader-version">v{ appRef.current.version}</span>
        </div>
      </div>
    </Layout>
  )
}

export default App
