
import React, { useEffect, useState } from 'react'

import { Select } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import { IRootState, IUserProfil } from '../../../../interface'
import { AppDispatch } from '../../../../store'
import { CloseCircleFilled } from '@ant-design/icons'
import { setReportIdUser } from '../../../../store/actions/report'

const { Option } = Select

export interface IFilterUsersDetailsReportComponentProps {
	users: IUserProfil[]
}

const FilterUsersDetailsReport: React.FunctionComponent<IFilterUsersDetailsReportComponentProps> = (props) => {
	const dispatch: AppDispatch = useDispatch()

	// const [idUser, setIdUSer] = useState<number | undefined>(undefined)
	const idUser = useSelector<IRootState, number | null>((state) => state.report.id_user)

	const [filteredUSers, setFilteredUSers] = useState<IUserProfil[]>(props.users)

	useEffect(() => {
		setFilteredUSers(props.users)
	}, [props.users])

	const options = filteredUSers.map(user => <Option key={`users-${user.id}`} value={user.id}>{user.firstname} {user.lastname}</Option>)
	// options.unshift(<Option key={'users-0'} value={0}><div>Aucun</div></Option>)

	const handleSearch = (value: string) => {
		const tmpUsers = props.users.filter((user) => {
			return user.firstname.includes(value) || user.lastname.includes(value)
		})
		setFilteredUSers(tmpUsers)
	}

	const handleChange = (value: number) => {
		dispatch(setReportIdUser(value))
	}

	const handleOnUnSelect = () => {
		dispatch(setReportIdUser(null))
	}

	return (
		<div className="filter-report-details-users"	>
		<Select
			className="filter-report-details-users"
			showSearch
			value={idUser || undefined}
			placeholder="choisir un equipier"
			// style={this.props.style}
			defaultActiveFirstOption={false}
			showArrow={false}
			onSearch={handleSearch}
			onChange={handleChange}
			notFoundContent={<span>Aucun equipier</span>}
		>

			{options}
		</Select>
		{idUser && <CloseCircleFilled className="filter-report-details-users-unselect" onClick={handleOnUnSelect}/>}
		</div>
	)
}

export default FilterUsersDetailsReport
