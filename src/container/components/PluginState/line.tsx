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
		green: props.status ===  'online',
		yellow: props.status === 'initializing',
	})


    return (
			<li key={`plugin-state-line-${props.event}`} className={colorIcon} >
				<div className='status-icon'><PluginStatusIcon event={props.event} status={props.status}/>
				</div>
				{ props.name && <div className='status-name'>{props.name}</div> }

			</li>
		)

}

export default PluginStateLIne
