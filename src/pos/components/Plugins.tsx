import React, { useState } from 'react'

import { Col, Row, Modal } from 'antd'
import { Button } from 'react-antd-cssvars'
import { useDispatch, useSelector } from 'react-redux'
import classNames from 'classnames'

import { IPinpad, IPlugin, IRootState } from '../interface'
import { closePinpadAction } from '../store/actions'

export interface IPluginsProps {
	plugins: IPlugin[]
}

const Plugins: React.FunctionComponent<IPluginsProps> = (props) => {
	return (
		<ul>
			 {props.plugins.filter((plugin) => {
				 return plugin.enabled
			 }).map((plugin) => {
				return <li>{plugin.name}</li>
			 })}
		</ul>
	)
}

export default Plugins
