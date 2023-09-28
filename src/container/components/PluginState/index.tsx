import React, { CSSProperties, useCallback, useMemo } from 'react'
import { useSelector } from 'react-redux'

import { IRootState, TWPTPluginState } from '../../interface'

import PluginLine from './line'
import { IConfig } from '../../helpers/config'

export interface IEmergency {
}
const PluginState: React.FunctionComponent<IEmergency> = () => {
	const pluginState = useSelector<IRootState, TWPTPluginState | null>((state) => state.pluginState)
	const conf = useSelector<IRootState,  IConfig | null>((state) => state.conf)


	const style = useMemo(() => {
		const newStyle:CSSProperties = {}
		if (conf && conf.display_plugin_state) {
			if (conf.display_plugin_state._position_right || conf.display_plugin_state._position_right === 0) {
				newStyle.right = conf.display_plugin_state._position_right + 'px'
			}
			if (conf.display_plugin_state._position_top || conf.display_plugin_state._position_top === 0) {
				newStyle.top = conf.display_plugin_state._position_top + 'px'
			}
			if (conf.display_plugin_state._radius || conf.display_plugin_state._radius === 0) {
				newStyle['borderRadius'] = conf.display_plugin_state._radius + 'px'
			}
			if (conf.display_plugin_state._direction) {
				newStyle.flexDirection = conf.display_plugin_state._direction
				if (conf.display_plugin_state._direction === 'column') {
					newStyle.gap = '0px'
				}
			}
		}
		return newStyle
	}, [conf])



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
			<ul id="menu-plugin-state" style={style}>
				{
					generatePluginState()
				}
			</ul>
		</React.Fragment>
	)
}

export default PluginState
