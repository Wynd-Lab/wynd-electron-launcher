

import React from 'react'

import { useSelector } from 'react-redux'
import { IRootState, IUserProfil } from '../../../../interface'

import UserFilter from './users'

export interface IFiltersDetailsReportComponentProps {
}

const FiltersDetailsReport: React.FunctionComponent<IFiltersDetailsReportComponentProps> = () => {
	const users = useSelector<IRootState, IUserProfil[]>((state) => state.report.users)

	return (
		<div className="report-details-filters"><div className="report-details-filters-title">Filtrer par</div><UserFilter users={users}/></div>
	)
}

export default FiltersDetailsReport
