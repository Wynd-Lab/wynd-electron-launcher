import React, { useCallback } from 'react'
import { useSelector } from 'react-redux'

import { IRootState, TWPTPluginState } from '../../interface'

import PluginStatusIcon from './status'

import PluginLine from './line'

export interface IEmergency {
}
const PluginState: React.FunctionComponent<IEmergency> = (props) => {
	const pluginState = useSelector<IRootState, TWPTPluginState | null>((state) => state.pluginState)

	// const conf = useSelector<IRootState, IConfig>((state) => state.conf as IConfig)
	// const wpt = useSelector<IRootState, IWPT>((state) => state.wpt)
	// const user = useSelector<IRootState, IUser>((state) => state.user)
	// const socket = useContext(SocketContext)

	const generatePluginState = useCallback(() => {
		const tmp: React.ReactNode[] = []
		if (pluginState) {
			for (const event in pluginState) {
					const plugin = pluginState[event]
					tmp.push(<PluginLine key={`plugin-state-line-${event}`} event={event} status={plugin.status} name={plugin.name}/>)
			}
		}
		return tmp
	},[pluginState])

	return (
		<React.Fragment>
			<ul id="menu-plugin-state">
				{
					generatePluginState()
				}
			</ul>
		</React.Fragment>
	)
}

export default PluginState
