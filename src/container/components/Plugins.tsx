import React from 'react'

import { IPlugin } from '../interface'

export interface IPluginsProps {
	plugins: IPlugin[]
}

const Plugins: React.FunctionComponent<IPluginsProps> = (props) => {
	return (
		<ul>
			 {props.plugins.filter((plugin) => {
				 return plugin.enabled
			 }).map((plugin, index) => {
				return <li key={`wpt-enabled-plugin-${index}`}>{plugin.name}</li>
			 })}
		</ul>
	)
}

export default Plugins
