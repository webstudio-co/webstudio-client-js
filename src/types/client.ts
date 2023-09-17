export type ConfigParams = {
	collection?: string
	path?: string
}

export type ExecuteResponse = {
	data: any
	error: any
}

export type QueryProps = {
	url: string
	name: string
	skip?: boolean
}

export type Resource = Record<string, any> & {
	id?: string
}

export type PageInfo = {
	page: number
	per_page: number
	total_count: number
	num_pages: number
}

export type MutationParams = {
	url: string
	name: string
}
