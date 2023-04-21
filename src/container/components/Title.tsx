
import React from 'react'


export interface IAppTitle {
  title: string;
}

const Title: React.FunctionComponent<IAppTitle> = (props) => {
	return (
		<div className="menu-title">
			{ props.title	}
		</div>
	)
}


export default Title
