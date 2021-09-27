
import React, { useEffect } from "react"
import { useSelector } from "react-redux"

import LoaderIcon from "../../icons/loader"
import { IRootState, ILoader } from "../../interface"
export interface ILoaderComponentProps {
}

const LoaderComponent: React.FunctionComponent<ILoaderComponentProps> = (props) => {

	return (
		<div className="menu-loader">
			<LoaderIcon size="large" />
		</div>
	)
}


export default LoaderComponent

