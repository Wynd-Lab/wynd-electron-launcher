import { convertReportCA } from '../helpers/format'
import { IEnvInfo, IReportCA, IReportCARaw, IReportDiscountRaw, IReportPaymentRaw, IReportProductRaw, IReportTeam, IReportX, IReportZ } from '../interface'

export const envConf: IEnvInfo = {
	'API_URL': 'https://api.pizza.demomkt.xyz/api',
	'API_CENTRAL_ENTITY': '2',
	'WPT_HOST': 'www.wyndengage.com',
	'WPT_PORT': '29964',
	'SOCKET_HOST': 'demomkt.xyz',
	'SOCKET_PORT': '49963',
	'DEFAULT_SERIAL': 'genericWyndSerial123456789',
	'MODE': 'MODE'
}

export const fakeReportX: IReportX = {
	'entity': {
		'id': 452,
		'name': 'Entity1620118752283',
		'address': '144 impasse de Maillet',
		'town': 'Gimenez',
		'zipcode': '81924',
		'phone': '+1797509680574',
		'code_siret': null,
		'vat_number': null
	},
	'uuid': null,
	'account_id': null,
	'team_member_id': null,
	'average_basket': 2.5,
	'total_net': 5000000,
	'nb_net': 25000,
	'total_gross': 5,
	'nb_gross': 2,
	'total_discount': 0,
	'nb_discount': 0,
	'total_meal_voucher': 0,
	'nb_meal_voucher': 0,
	'nb_sales_canceled': 1,
	'nb_sales_partially_cancelled': 0,
	'nb_sales_refund_without_original_sale': 0,

}

export const fakeReportX2: IReportX = {
	'entity': {
		'id': 452,
		'name': 'Entity1620118752283',
		'address': '144 impasse de Maillet',
		'town': 'Gimenez',
		'zipcode': '81924',
		'phone': '+1797509680574',
		'code_siret': null,
		'vat_number': null
	},
	'uuid': null,
	'account_id': null,
	'team_member_id': null,
	'average_basket': 2.5,
	'total_net': 500000,
	'nb_net': 25000,
	'total_gross': 5,
	'nb_gross': 2,
	'total_discount': 0,
	'nb_discount': 0,
	'total_meal_voucher': 0,
	'nb_meal_voucher': 0,
	'nb_sales_canceled': 1,
	'nb_sales_partially_cancelled': 0,
	'nb_sales_refund_without_original_sale': 0,

}


export const fakeTeamReport: IReportTeam = {
	'fiscal_date': '2021-09-09',
	'start_date': '2021-09-09 05:00:00',
	'end_date': '2021-09-10 04:58:00',
	'account_id': null,
	'team_member_id': null,
	'users': [
		{
			'user': {
				'id': 2,
				'firstname': 'Wynd',
				'lastname': 'Support'
			},
			'uuid': '64149c1e-b7bd-47e6-94be-7055eef0d3cc',
			'sales': 4, 'amount': 69.2, 'sales_percent': 100, 'amount_percent': 100
		}
	]
}
export const fakeReports: IReportZ[] = [
	{
    'entity': {
        'id': 2,
        'name': 'BBG Avignon Republique 2',
        'address': '26 Rue de la République',
        'town': 'AVIGNON',
        'zipcode': '84000',
        'phone': '',
        'code_siret': '47845579301329',
        'vat_number': '478 455 793 01329'
    },
    'user': {
        'id': 1,
        'firstname': 'Admin',
        'lastname': 'Strateur'
    },
    'uuid': '79f6ebdc-63fb-4b48-b91d-3ad547dbe0c7',
    'report_id': '3b4775b4-17b2-11ec-a620-02420a0a220a',
    'fiscal_date': '2021-09-07',
    'start_date': '2021-07-09T05:00:00+02:00',
    'end_date': '2021-07-10T04:58:00+02:00',
    'account_id': null,
    'team_member_id': null,
    'average_basket': 17.3,
    'total_net': 69.2,
    'nb_net': 4,
    'total_gross': 69.2,
    'nb_gross': 4,
    'total_discount': 12,
    'nb_discount': 1,
    'total_meal_voucher': 0,
    'nb_meal_voucher': 0,
    'nb_sales_canceled': 0,
    'nb_sales_partially_cancelled': 0,
    'nb_sales_refund_without_original_sale': 0
	},
	{
		'entity': {
			'id': 2,
			'name': 'BBG Avignon Republique 2',
			'address': '26 Rue de la République',
			'town': 'AVIGNON',
			'zipcode': '84000',
			'phone': '',
			'code_siret': '47845579301329',
			'vat_number': '478 455 793 01329'
		},
		'user': {
			'id': 1,
			'firstname': 'Admin',
			'lastname': 'Strateur'
		},
		'uuid': '8a84ee0d-b04e-46e9-ba06-6dcc4c9e4d16',
		'report_id': 'f41d95b2-17b4-11ec-af8b-02420a0a220a',
		'fiscal_date': '2021-09-08',
		'start_date': '2021-09-08T05:00:00+02:00',
		'end_date': '2021-09-09T04:58:00+02:00',
		'account_id': null,
		'team_member_id': null,
		'average_basket': 13.86428571,
		'total_net': 194.1,
		'nb_net': 14,
		'total_gross': 194.1,
		'nb_gross': 14,
		'total_discount': 20.2,
		'nb_discount': 6,
		'total_meal_voucher': 0,
		'nb_meal_voucher': 0,
		'nb_sales_canceled': 0,
		'nb_sales_partially_cancelled': 0,
		'nb_sales_refund_without_original_sale': 0
	},
	{
		'entity': {
			'id': 2,
			'name': 'BBG Avignon Republique 2',
			'address': '26 Rue de la République',
			'town': 'AVIGNON',
			'zipcode': '84000',
			'phone': '',
			'code_siret': '47845579301329',
			'vat_number': '478 455 793 01329'
		},
		'user': {
			'id': 1,
			'firstname': 'Admin',
			'lastname': 'Strateur'
		},
		'uuid': '79f6ebdc-63fb-4b48-b91d-3ad547dbe0c6',
		'report_id': '3b4775b4-17b2-11ec-a620-02420a0a220a',
		'fiscal_date': '2021-09-09',
		'start_date': '2021-09-09T05:00:00+02:00',
		'end_date': '2021-09-10T04:58:00+02:00',
		'account_id': null,
		'team_member_id': null,
		'average_basket': 17.3,
		'total_net': 69.2,
		'nb_net': 4,
		'total_gross': 69.2,
		'nb_gross': 4,
		'total_discount': 12,
		'nb_discount': 1,
		'total_meal_voucher': 0,
		'nb_meal_voucher': 0,
		'nb_sales_canceled': 0,
		'nb_sales_partially_cancelled': 0,
		'nb_sales_refund_without_original_sale': 0
	},
	{
		'entity': {
			'id': 2,
			'name': 'BBG Avignon Republique 2',
			'address': '26 Rue de la République',
			'town': 'AVIGNON',
			'zipcode': '84000',
			'phone': '',
			'code_siret': '47845579301329',
			'vat_number': '478 455 793 01329'
		},
		'user': {
			'id': 1,
			'firstname': 'Admin',
			'lastname': 'Strateur'
		},
		'uuid': '8e9f42fd-fafb-4a33-8d1b-5a258f848d2e',
		'report_id': '37dac2e6-17b2-11ec-a442-02420a0a220a',
		'fiscal_date': '2021-09-10',
		'start_date': '2021-09-10T05:00:00+02:00',
		'end_date': '2021-09-11T04:58:00+02:00',
		'account_id': null,
		'team_member_id': null,
		'average_basket': 0,
		'total_net': 0,
		'nb_net': 0,
		'total_gross': 0,
		'nb_gross': 0,
		'total_discount': 0,
		'nb_discount': 0,
		'total_meal_voucher': 0,
		'nb_meal_voucher': 0,
		'nb_sales_canceled': 0,
		'nb_sales_partially_cancelled': 0,
		'nb_sales_refund_without_original_sale': 0
	},
	{
		'entity': {
			'id': 2,
			'name': 'BBG Avignon Republique 2',
			'address': '26 Rue de la République',
			'town': 'AVIGNON',
			'zipcode': '84000',
			'phone': '',
			'code_siret': '47845579301329',
			'vat_number': '478 455 793 01329'
		},
		'user': {
			'id': 1,
			'firstname': 'Admin',
			'lastname': 'Strateur'
		},
		'uuid': '0143e648-526c-4579-8415-04d9957707bb',
		'report_id': '32b9981e-17b2-11ec-a047-02420a0a220a',
		'fiscal_date': '2021-09-11',
		'start_date': '2021-09-11T05:00:00+02:00',
		'end_date': '2021-09-12T04:58:00+02:00',
		'account_id': null,
		'team_member_id': null,
		'average_basket': 0,
		'total_net': 0,
		'nb_net': 0,
		'total_gross': 0,
		'nb_gross': 0,
		'total_discount': 0,
		'nb_discount': 0,
		'total_meal_voucher': 0,
		'nb_meal_voucher': 0,
		'nb_sales_canceled': 0,
		'nb_sales_partially_cancelled': 0,
		'nb_sales_refund_without_original_sale': 0
	},
	{
		'entity': {
			'id': 2,
			'name': 'BBG Avignon Republique 2',
			'address': '26 Rue de la République',
			'town': 'AVIGNON',
			'zipcode': '84000',
			'phone': '',
			'code_siret': '47845579301329',
			'vat_number': '478 455 793 01329'
		},
		'user': {
			'id': 1,
			'firstname': 'Admin',
			'lastname': 'Strateur'
		},
		'uuid': '38ea464b-b1e0-42bc-9a74-ae192125ad67',
		'report_id': '2d8d4390-17b2-11ec-89dc-02420a0a220a',
		'fiscal_date': '2021-09-12',
		'start_date': '2021-09-12T05:00:00+02:00',
		'end_date': '2021-09-13T04:58:00+02:00',
		'account_id': null,
		'team_member_id': null,
		'average_basket': 0,
		'total_net': 0,
		'nb_net': 0,
		'total_gross': 0,
		'nb_gross': 0,
		'total_discount': 0,
		'nb_discount': 0,
		'total_meal_voucher': 0,
		'nb_meal_voucher': 0,
		'nb_sales_canceled': 0,
		'nb_sales_partially_cancelled': 0,
		'nb_sales_refund_without_original_sale': 0
	},
	{
		'entity': {
			'id': 2,
			'name': 'BBG Avignon Republique 2',
			'address': '26 Rue de la République',
			'town': 'AVIGNON',
			'zipcode': '84000',
			'phone': '',
			'code_siret': '47845579301329',
			'vat_number': '478 455 793 01329'
		},
		'user': {
			'id': 1,
			'firstname': 'Admin',
			'lastname': 'Strateur'
		},
		'uuid': 'ab40e6c5-4a2e-463d-8a10-aa4dee25383b',
		'report_id': '2a88bfe4-17b2-11ec-ac16-02420a0a220a',
		'fiscal_date': '2021-09-13',
		'start_date': '2021-09-13T05:00:00+02:00',
		'end_date': '2021-09-14T04:58:00+02:00',
		'account_id': null,
		'team_member_id': null,
		'average_basket': 0,
		'total_net': 0,
		'nb_net': 0,
		'total_gross': 0,
		'nb_gross': 0,
		'total_discount': 0,
		'nb_discount': 0,
		'total_meal_voucher': 0,
		'nb_meal_voucher': 0,
		'nb_sales_canceled': 0,
		'nb_sales_partially_cancelled': 0,
		'nb_sales_refund_without_original_sale': 0
	},
	{
		'entity': {
			'id': 2,
			'name': 'BBG Avignon Republique 2',
			'address': '26 Rue de la République',
			'town': 'AVIGNON',
			'zipcode': '84000',
			'phone': '',
			'code_siret': '47845579301329',
			'vat_number': '478 455 793 01329'
		},
		'user': {
			'id': 1,
			'firstname': 'Admin',
			'lastname': 'Strateur'
		},
		'uuid': '01094101-5d8e-4f9a-ba75-672fb254e660',
		'report_id': '27d405b0-17b2-11ec-a7b3-02420a0a220a',
		'fiscal_date': '2021-09-14',
		'start_date': '2021-09-14T05:00:00+02:00',
		'end_date': '2021-09-15T04:58:00+02:00',
		'account_id': null,
		'team_member_id': null,
		'average_basket': 0,
		'total_net': 0,
		'nb_net': 0,
		'total_gross': 0,
		'nb_gross': 0,
		'total_discount': 0,
		'nb_discount': 0,
		'total_meal_voucher': 0,
		'nb_meal_voucher': 0,
		'nb_sales_canceled': 0,
		'nb_sales_partially_cancelled': 0,
		'nb_sales_refund_without_original_sale': 0
	},
	{
		'entity': {
			'id': 2,
			'name': 'BBG Avignon Republique 2',
			'address': '26 Rue de la République',
			'town': 'AVIGNON',
			'zipcode': '84000',
			'phone': '',
			'code_siret': '47845579301329',
			'vat_number': '478 455 793 01329'
		},
		'user': {
			'id': 1,
			'firstname': 'Admin',
			'lastname': 'Strateur'
		},
		'uuid': '7f3fd708-4450-498b-8603-24cc39f1d278',
		'report_id': '248551a2-17b2-11ec-ae6c-02420a0a220a',
		'fiscal_date': '2021-09-15',
		'start_date': '2021-09-15T05:00:00+02:00',
		'end_date': '2021-09-16T04:58:00+02:00',
		'account_id': null,
		'team_member_id': null,
		'average_basket': 0,
		'total_net': 0,
		'nb_net': 0,
		'total_gross': 0,
		'nb_gross': 0,
		'total_discount': 0,
		'nb_discount': 0,
		'total_meal_voucher': 0,
		'nb_meal_voucher': 0,
		'nb_sales_canceled': 0,
		'nb_sales_partially_cancelled': 0,
		'nb_sales_refund_without_original_sale': 0
	},
	{
		'entity': {
			'id': 2,
			'name': 'BBG Avignon Republique 2',
			'address': '26 Rue de la République',
			'town': 'AVIGNON',
			'zipcode': '84000',
			'phone': '',
			'code_siret': '47845579301329',
			'vat_number': '478 455 793 01329'
		},
		'user': {
			'id': 1,
			'firstname': 'Admin',
			'lastname': 'Strateur'
		},
		'uuid': 'ab5e1205-f9a9-49af-bb24-4e3372e7924e',
		'report_id': 'e3d8751c-17b1-11ec-b211-02420a0a220a',
		'fiscal_date': '2021-09-16',
		'start_date': '2021-09-16T05:00:00+02:00',
		'end_date': '2021-09-17T04:58:00+02:00',
		'account_id': null,
		'team_member_id': null,
		'average_basket': 0,
		'total_net': 0,
		'nb_net': 0,
		'total_gross': 0,
		'nb_gross': 0,
		'total_discount': 0,
		'nb_discount': 0,
		'total_meal_voucher': 0,
		'nb_meal_voucher': 0,
		'nb_sales_canceled': 0,
		'nb_sales_partially_cancelled': 0,
		'nb_sales_refund_without_original_sale': 0
	}
]

export const fakeCARaw: IReportCARaw = {
	'fiscal_date': '2021-09-09',
	'start_date': '2021-09-09 05:00:00',
	'end_date': '2021-09-10 04:58:00',
	'account_id': null,
	'team_member_id': null,
	'rates': [
		{ 'uuid': 'e6789b9d-4825-4eb2-89b3-ca006193b951', 'type_label': 'gross', 'destination_label': 'ONSITE', 'rate_vat': 10, 'total_ttc': 41.4, 'total_vat': 3.75, 'total_ht': 37.65 },
		{ 'uuid': '893ada2b-5c1b-4be6-9606-8ea4cb277cfc', 'type_label': 'gross', 'destination_label': 'ONSITE', 'rate_vat': 5.5, 'total_ttc': 3.8, 'total_vat': 0.2, 'total_ht': 3.6 },
		{ 'uuid': '452c0ca2-ef66-458d-875d-d8127dda0ba0', 'type_label': 'gross', 'destination_label': 'TAKEAWAY', 'rate_vat': 10, 'total_ttc': 36, 'total_vat': 3.27, 'total_ht': 32.73 },
		{ 'uuid': '56a0ccfb-fe02-4936-aeed-01904a7c93c2', 'type_label': 'net', 'destination_label': 'ONSITE', 'rate_vat': 10, 'total_ttc': 41.4, 'total_vat': 3.75, 'total_ht': 37.65 },
		{ 'uuid': '4696c0e8-df14-495c-b647-7d49492ef10d', 'type_label': 'net', 'destination_label': 'ONSITE', 'rate_vat': 5.5, 'total_ttc': 3.8, 'total_vat': 0.2, 'total_ht': 3.6 },
		{ 'uuid': '4c4d37d5-6900-4866-ab88-f0b3253440f8', 'type_label': 'net', 'destination_label': 'TAKEAWAY', 'rate_vat': 10, 'total_ttc': 24, 'total_vat': 4.36, 'total_ht': 43.64 }
	]
}

export const fakeCA: IReportCA[] = convertReportCA(fakeCARaw)


export const fakePayment: IReportPaymentRaw = {
	'fiscal_date': '2021-05-04',
	'start_date': '2021-05-04 00:00:01',
	'end_date': '2021-05-05 00:00:00',
	'account_id': null,
	'team_member_id': null,
	'payments': [
		{
			'uuid': '4dca2cf9-611b-4c99-a802-f2d27970ca96',
			'default_label': 'Especes',
			'quantity': 3,
			'amount': 150,
			'quantity_percent': 50,
			'amount_percent': 50
		},
		{
			'uuid': '4dca2cf9-611b-4c99-a802-f2d27970ca97',
			'default_label': 'Cheque',
			'quantity': 2,
			'amount': 36.99,
			'quantity_percent': 33.33,
			'amount_percent': 26.77
		},
		{
			'uuid': '4dca2cf9-611b-4c99-a802-f2d27970ca98',
			'default_label': 'CB',
			'quantity': 1,
			'amount': 16.97,
			'quantity_percent': 15.80,
			'amount_percent': 9.60
		}
	]
}


export const fakeDiscount: IReportDiscountRaw = {
	'fiscal_date': '2021-05-04',
	'start_date': '2021-05-04 00:00:01',
	'end_date': '2021-05-05 00:00:00',
	'account_id': null,
	'team_member_id': null,
	'discounts': [
		{
			'label': 'Réduction Panier 25%',
			'quantity': 1,
			'amount': 25,
			'quantity_percent': 100,
			'amount_percent': 100
		}
	]
}

export const fakeProduct: IReportProductRaw = {
	'report_id': null,
	'fiscal_date': '2021-05-04',
	'start_date': '2021-05-04 00:00:01',
	'end_date': '2021-05-05 00:00:00',
	'account_id': null,
	'team_member_id': null,
	'products': [
		{
			'division': {
				'label': 'General '
			},
			'product': {
				'id': 10,
				'default_label': 'Kawaii cups'
			},
			'uuid': '770564ab-0d93-4424-89e0-36bd32d07f54',
			'division_label': 'General ',
			'sub_division_label': null,
			'product_label': 'Kawaii cups',
			'product_id': 10,
			'quantity': 1,
			'amount': 100,
			'total_discount': -25,
			'fk_report': '4d01ed24-acb0-11eb-8371-02420a0a030b',
			'quantity_percent': 100,
			'amount_percent': 100
		}
	]
}
