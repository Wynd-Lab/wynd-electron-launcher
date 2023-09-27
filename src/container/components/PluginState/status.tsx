 import React from 'react'
import { TPluginStatus } from '../../interface'

import Balance from '../../icons/balance'
import Card from '../../icons/card'
import Check from '../../icons/check'
import Cross from '../../icons/cross'
import Printer from '../../icons/printer'
import Rfid from '../../icons/rfid'
import Cashdrawer from '../../icons/cashdrawer'
import Central from '../../icons/central'

export interface IPluginStatusIcon {
  event: string
	status: TPluginStatus
}

const PluginStatusIcon: React.FunctionComponent<IPluginStatusIcon> = (props) => {

		const getIcons = () => {

			if (props.event === 'central') {
				return <Central size="20" style={{ transform: 'translateY(-1px)', marginLeft: '4px', marginRight: '8px'}}/>
			}
			if (props.event === 'cashdrawer') {
				return <Cashdrawer size="20" style={{ transform: 'translateY(-1px)', marginLeft: '3px', marginRight: '7px'}}/>
			}
			if (props.event === 'rfidupos') {
				return <Rfid size="20" style={{ transform: 'translateY(-2px)', marginLeft: '3px', marginRight: '7px'}}/>
			}
			if (props.event === 'balance') {
				return <Balance size="20" style={{ transform: 'translateY(-1px)', marginLeft: '3px', marginRight: '7px'}}/>
			}
			if (props.event === 'fastprinter') {
				return <Printer size="20" style={{ marginLeft: '4px', marginRight: '8px'}}/>
			}
			if (props.event === 'universalterminal') {
				return <Card size="19" style={{ transform: 'translateY(1px)', marginLeft: '4px', marginRight: '8px'}}/>
			}
			if (props.status === 'online') {
				return  <Check style={{ transform: 'translateY(-1px)', marginLeft: '2px', marginRight: '6px'}}/>
			}
			if (props.status === 'initializing') {
				return  <Check style={{ transform: 'translateY(-1px)', marginLeft: '2px', marginRight: '6px'}}/>
			}
			return <Cross style={{ transform: 'translateY(-1px)', marginLeft: '-1px', marginRight: '1px'}}/>
		}

    return <>
			{getIcons()}
		</>
}

export default PluginStatusIcon
