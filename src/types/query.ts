export type Operator =
	| 'asc'
	| 'desc'
	| 'true'
	| 'false'
	| 'eq'
	| 'neq'
	| 'like'
	| 'gt'
	| 'gte'
	| 'lt'
	| 'lte'
	| 'in'
	| 'nin'
	| 'include'
	| '1_day_ago'
	| '7_days_ago'
	| '14_days_ago'
	| '30_days_ago'
	| '60_days_ago'
	| '90_days_ago'

export type FilterOption = {
	where: 'AND' | 'OR'
	field: string
	operator: Operator
	value: any | any[]
}

export type Value = string | number | string[] | number[]

export type Filter = {
	[field: string]: {
		[operator in Operator]?: Value
	}
}

export type Filters = {
	AND?: Filter[]
	OR?: Filter[]
}

export type QueryParams = {
	sort_by?: string
	sort_direction?: 'asc' | 'desc'
	keywords?: string
	filters?: Filters | Record<string, any>
	page?: number
	per_page?: number
}

export type QueryFilterArrayParams = {
	sort_by?: string
	sort_direction?: 'asc' | 'desc'
	keywords?: string
	filters?: FilterOption[]
	page?: number
	per_page?: number
}

export type QueryURLParams = {
	order?: string
	keywords?: string
	filters?: string
	page?: number
	per_page?: number
}
