export interface IEnvInfo {
	API_CENTRAL_ENTITY: string
	API_URL: string
	DEFAULT_SERIAL: string
	MODE: string
	SOCKET_HOST: string
	SOCKET_PORT: string
	WPT_HOST: string
	WPT_PORT: string
}
export interface IReport {
	env: IEnvInfo | null
	start_date: string | null
	end_date: string | null
	reports: IReportZ[]
}



export interface IEntity {
	id: number
	name: string
	address: string
	town: string
	zipcode: string
	phone: string
	code_siret: string | null
	vat_number: string | null
}

export interface IMinReport {
	total_net: number,
	nb_net: number,
	average_basket: number
}

export interface IReportX extends IMinReport{
	entity: IEntity
	uuid: string | null,
	account_id: string | null,
	team_member_id: string | null,
	total_gross: number,
	nb_gross: number,
	total_discount: number,
	nb_discount: number,
	total_meal_voucher: number,
	nb_meal_voucher: number,
	nb_sales_canceled: number,
	nb_sales_partially_cancelled: number,
	nb_sales_refund_without_original_sale: number
}



export interface IReportZ extends IReportX {
	user: IUserProfil
	uuid: string | null,
	report_id: string | null,
	fiscal_date: string,
	start_date: string,
	end_date: string,
	account_id: string | null,
	team_member_id: string | null,
	average_basket: number,
	total_net: number,
	nb_net: number,
	total_gross: number,
	nb_gross: number,
	total_discount: number,
	nb_discount: number,
	total_meal_voucher: number,
	nb_meal_voucher: number,
	nb_sales_canceled: number,
	nb_sales_partially_cancelled: number,
	nb_sales_refund_without_original_sale: number
}

export interface ITableReport {
	date: string
	ca_net: number
	ca_brut: number
	nb_net: number
	average_basket: number
}

// export interface IDetails {
// 	id: number
// 	fiscal_date: string
// }

export interface IHeadReport {
	fiscal_date: string
	start_date: string
	end_date: string
	account_id: number | null
	team_member_id: number | null
}


export interface IReportStat {
	uuid: string
	default_label: string
	quantity: number | null
	amount: number | null
	quantity_percent: number | null
	amount_percent: number | null
}

export interface IReportPayment {
	uuid: string
	default_label: string
	quantity: number
	amount: number
	quantity_percent: number
	amount_percent: number
}

export interface IReportDiscount {
	label: string
	quantity: number
	amount: number
	quantity_percent: number
	amount_percent: number
}

export interface IReportProduct {
	uuid: string
	division: {
		label: string
	}
	product: {
		id: number
		default_label: string
	}
	division_label: string
	sub_division_label: string | null
	product_id: number
	quantity: number
	product_label: string
	amount: number
	quantity_percent: number
	amount_percent: number
	total_discount: number
	fk_report: string
}

export interface IReportCARaw extends IHeadReport {
	rates: IReportRate[]
}

export interface IReportPaymentRaw extends IHeadReport {
	payments: IReportPayment[]
}

export interface IReportDiscountRaw extends IHeadReport {
	discounts: IReportDiscount[]
}

export interface IReportProductRaw extends IHeadReport {
	report_id: string | null
	products: IReportProduct[]
}


export interface IUserProfil {
	id: number
	firstname: string
	lastname: string
}

export interface IUserReport {
	uuid: string
	sales: number
	amount: number
	sales_percent: number
	amount_percent: number
	user: IUserProfil
}

export interface IReportTeam extends IHeadReport {
	users: IUserReport[]
}

export interface IReportRate {
	uuid: string
	rate_vat: number
	type_label: 'gross' | 'net'
	destination_label: 'ONSITE' | 'TAKEAWAY'
	total_ht: number
	total_ttc: number
	total_vat: number
}
export interface IReportCAByType {
	rates: IReportRate[]
	total_ht: number
	total_ttc: number
	total_vat: number
}
export interface IReportCA {
	type: 'GLOBAL' | 'ONSITE' | 'TAKEAWAY'
	fiscal_date: string
	start_date: string
	end_date: string
	gross: IReportCAByType
	net: IReportCAByType
}
