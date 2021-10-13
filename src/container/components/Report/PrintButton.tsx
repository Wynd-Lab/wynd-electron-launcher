
import React from 'react'

import Button from '../Button'
import { InfoCircleOutlined } from '@ant-design/icons'
import { IButtonProps } from 'react-antd-cssvars/dist/components/Button'

export interface IDetailsButtonComponentProps extends IButtonProps{
}

const DetailsButton: React.FunctionComponent<IDetailsButtonComponentProps> = (props) => {


	return (
		<Button
			type="link"
			onClick={props.onClick}
		>
			<InfoCircleOutlined /> Imprimer
		</Button>
	)
}


export default DetailsButton
