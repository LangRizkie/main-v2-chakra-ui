import type { Key } from 'react'

export type GetDataSort = {
	field: string
	dir: string
}

export type GetDataFilters = {
	field: string
	operator: string
	value: string
	logic: string
}

export type GetDataFilter = {
	filters: GetDataFilters[]
}

export type PaginationPayload = {
	search: string
	customViewId: Key
	columnSearch: string[]
	sort: GetDataSort[]
	filter: GetDataFilter
	start: Key
	length: Key
}

export type DownloadDataPayload = PaginationPayload & {
	format: string
	type: string
	[key: string]: unknown
}

export type DeleteDataPayload = {
	pkid: Key[]
}
