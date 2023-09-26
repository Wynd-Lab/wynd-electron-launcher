import React from 'react'
import { TPluginStatus } from '../../interface'

import PluginStatusIcon from './status'
import classNames from 'classnames'


export interface IPluginStatusIcon {
  event: string
	name: string
	status: TPluginStatus
}

const PluginStateLIne: React.FunctionComponent<IPluginStatusIcon> = (props) => {

	const colorIcon = classNames({
		red: props.status ===  'offline',
		green: props.status ===  'online'
	})


    return (
			<li key={`plugin-state-line-${props.event}`} className={colorIcon} ><span><PluginStatusIcon event={props.event} status={props.status}/></span><span>{props.name}</span></li>
		)

}

export default PluginStateLIne
