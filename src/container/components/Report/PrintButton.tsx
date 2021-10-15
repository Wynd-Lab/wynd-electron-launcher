
import React from 'react'

import Button from '../Button'
import { PrinterOutlined } from '@ant-design/icons'
import { IButtonProps } from 'react-antd-cssvars/dist/components/Button'

export interface IDetailsButtonComponentProps extends IButtonProps{
}

const DetailsButton: React.FunctionComponent<IDetailsButtonComponentProps> = (props) => {


	return (
		<Button
			type="link"
			onClick={props.onClick}
		>
			<PrinterOutlined /> Imprimer
		</Button>
	)
}


export default DetailsButton
