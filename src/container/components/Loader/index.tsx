
import React from 'react'

import LoaderIcon from '../../icons/loader'
export interface ILoaderComponentProps {
}

const LoaderComponent: React.FunctionComponent<ILoaderComponentProps> = () => {

	return (
		<div className="menu-loader">
			<LoaderIcon size="large" />
		</div>
	)
}


export default LoaderComponent

