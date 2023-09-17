import { ApiQuery } from './ApiQuery'
import { RestClient } from './RestClient'
import { QueryParams } from '../types/query'
import {
	ConfigParams,
	ExecuteResponse,
} from '../types/client'

export class ApiClient {
	private payload?: Record<string, any>
	private _path?: string
	private _collection: string 
	private endpoint?: string
	private headers: Record<string, any>
	private apiQuery: ApiQuery
	private restClient: RestClient

	constructor(
		baseURL: string | null,
		fetchToken: () => string | null,
		apiKey: string | null = null,
		authToken: string | null = null
	) {
		this.apiQuery = new ApiQuery()
		this.restClient = new RestClient(
			baseURL,
			fetchToken,
			apiKey,
			authToken
		)
		this.payload = {}
		this.headers = {
			'Content-Type': 'application/json',
		}
		this._path = ''
		this._collection = ''
		this.endpoint = ''
		return new Proxy(this, {
			get(target: any, prop) {
				if (typeof target[prop] !== 'undefined') {
					return target[prop]
				}
				target._collection = prop?.toString()
				target._path = `/${prop?.toString()}`
				return target
			},
		})
	}

	// Manually set the collection params
	config(params: ConfigParams) {
		if (typeof params !== 'object') {
			throw Error('Collection must be an object')
		}
		this.setDefaults()
		const { collection, path } = params
		if (typeof collection === 'string') {
			this._collection = collection
		}
		if (typeof path === 'string') {
			this._path = path
		}
		return this
	}

	url(path: string): ApiClient {
		this._path = path
		return this
	}

	collection(collection: string): ApiClient {
		this.setDefaults()
		this._collection = collection
		return this
	}

	setDefaults(): ApiClient {
		this._collection = ''
		this._path = ''
		this.payload = {}
		this.apiQuery = new ApiQuery()
		return this
	}

	query(params: QueryParams): ApiClient {
		this.apiQuery = new ApiQuery(params)
		return this
	}

	eq(field: string, value: string | number): ApiClient {
		this.apiQuery.eq(field, value)
		return this
	}

	neq(field: string, value: string | number): ApiClient {
		this.apiQuery.neq(field, value)
		return this
	}

	gt(field: string, value: string | number): ApiClient {
		this.apiQuery.gt(field, value)
		return this
	}

	gte(field: string, value: string | number): ApiClient {
		this.apiQuery.gte(field, value)
		return this
	}

	lt(field: string, value: string | number): ApiClient {
		this.apiQuery.lt(field, value)
		return this
	}

	lte(field: string, value: string | number): ApiClient {
		this.apiQuery.lte(field, value)
		return this
	}

	in(field: string, value: string | number): ApiClient {
		this.apiQuery.in(field, value)
		return this
	}

	nin(field: string, value: string | number): ApiClient {
		this.apiQuery.nin(field, value)
		return this
	}

	sort(
		field: string,
		direction: 'asc' | 'desc'
	): ApiClient {
		this.apiQuery.sort(field, direction)
		return this
	}

	search(query: string) {
		this.apiQuery.search(query)
		return this
	}

	filter(filters: any) {
		this.apiQuery.filter(filters)
		return this
	}

	page(page: number) {
		this.apiQuery.page = page
		return this
	}

	per(perPage: number) {
		this.apiQuery.per_page = perPage
		return this
	}

	async findOne(id: number): Promise<ExecuteResponse> {
		this.endpoint = `${this._path}/${id}`
		return await this.restClient.get(this.endpoint)
	}

	async findMany(
		searchParams: QueryParams
	): Promise<ExecuteResponse> {
		this.apiQuery.where(searchParams)
		this.endpoint = this._path
		return await this.restClient.get(
			this.endpoint || '',
			this.apiQuery.url()
		)
	}

	async create(
		data: Record<string, any>
	): Promise<ExecuteResponse> {
		this.payload = data
		this.handleMultipartData()
		this.endpoint = this._path
		return await this.restClient.post(
			this._path || '',
			this.payload,
			this.headers
		)
	}

	async update(
		data: Record<string, any>
	): Promise<ExecuteResponse> {
		this.payload = data
		this.handleMultipartData()
		this.endpoint = `${this._path}/${data.id}`
		return await this.restClient.put(
			this.endpoint,
			this.payload,
			this.headers
		)
	}

	async destroy(id: number): Promise<ExecuteResponse> {
		this.endpoint = `${this._path}/${id}`
		return await this.restClient.delete(this.endpoint)
	}

	async updatePositions(
		sorted: Record<string, any>[]
	): Promise<ExecuteResponse> {
		this.payload = {
			ids: sorted.map((resource) => resource.id),
			positions: sorted.map((_, index) => index),
		}
		this.endpoint = `${this._path}/update_positions`
		return await this.restClient.post(
			this.endpoint,
			this.payload
		)
	}

	async updateMany(
		ids: number[],
		resource: object
	): Promise<ExecuteResponse> {
		this.payload = {
			ids: ids,
			resoure: resource,
		}
		this.endpoint = `${this._path}/update_many`
		return await this.restClient.post(
			this.endpoint,
			this.payload
		)
	}

	async destroyMany(
		ids: number[]
	): Promise<ExecuteResponse> {
		if (!Array.isArray(ids)) {
			throw Error('Ids must be an array')
		}
		this.payload = {
			ids: ids,
		}
		this.endpoint = `${this._path}/delete_many`
		return await this.restClient.post(
			this.endpoint,
			this.payload
		)
	}

	async publish(id: number): Promise<ExecuteResponse> {
		this.endpoint = `${this._path}/${id}/publish`
		return await this.restClient.post(this.endpoint)
	}

	async unpublish(id: number): Promise<ExecuteResponse> {
		this.endpoint = `${this._path}/${id}/unpublish`
		return await this.restClient.post(this.endpoint)
	}

	async addLinks(
		sourceId: number,
		contentType: string,
		targetIds: number[]
	): Promise<ExecuteResponse> {
		this.payload = {
			[this._collection]: {
				content_type: contentType,
				ids: targetIds,
			},
		}
		this.endpoint = `${this._path}/${sourceId}/add_links`
		return await this.restClient.post(
			this.endpoint,
			this.payload
		)
	}

	async removeLinks(
		sourceId: number,
		targetIds: number[]
	): Promise<ExecuteResponse> {
		this.payload = {
			[this._collection]: {
				ids: targetIds,
			},
		}
		this.endpoint = `${this._path}/${sourceId}/remove_links`
		return await this.restClient.post(
			this.endpoint,
			this.payload
		)
	}

	async addAttachment(
		id: number,
		name: string,
		attachmentId: number
	): Promise<ExecuteResponse> {
		this.payload = {
			[this._collection]: {
				name: name,
				id: attachmentId,
			},
		}
		this.endpoint = `${this._path}/${id}/add_attachment`
		return await this.restClient.post(
			this.endpoint,
			this.payload
		)
	}

	async removeAttachment(
		id: number,
		name: string,
		attachmentId: number
	): Promise<ExecuteResponse> {
		this.payload = {
			[this._collection]: {
				name: name,
				id: attachmentId,
			},
		}
		this.endpoint = `${this._path}/${id}/remove_attachment`
		return await this.restClient.post(
			this.endpoint,
			this.payload
		)
	}

	parseURL(routerParams: any) {
		this.apiQuery.parseURL(routerParams)
		return this
	}

	async get(
		endpoint: string,
		params?: string
	): Promise<ExecuteResponse> {
		this.endpoint = endpoint
		return await this.restClient.get(this.endpoint, params)
	}

	async post(
		endpoint: string,
		payload: object
	): Promise<ExecuteResponse> {
		this.payload = payload
		this.endpoint = endpoint
		this.handleMultipartData()
		return await this.restClient.post(
			this.endpoint,
			this.payload,
			this.headers
		)
	}

	async put(
		endpoint: string,
		payload: object
	): Promise<ExecuteResponse> {
		this.payload = payload
		this.endpoint = endpoint
		this.handleMultipartData()
		return await this.restClient.put(
			this.endpoint,
			this.payload,
			this.headers
		)
	}

	async delete(endpoint: string): Promise<ExecuteResponse> {
		this.endpoint = endpoint
		return await this.restClient.delete(this.endpoint)
	}

	// Check if payload contains a File object
	// and create FormData and set headers if it does

	handleMultipartData(): void {
		for (const key in this.payload) {
			if (this.payload[key] instanceof File) {
				const formData = new FormData()
				for (const formKey in this.payload) {
					formData.append(
						`${this._collection}[${formKey}]`,
						this.payload[formKey]
					)
				}
				this.payload = formData
				this.headers['Content-Type'] = 'multipart/form-data'
				break
			}
		}
	}
}

export const createClient = (
	baseURL: string,
	fetchToken: () => any,
	apiKey: string | null = null,
	authToken: string | null = null
): ApiClient => {
	return new ApiClient(
		baseURL,
		fetchToken,
		apiKey,
		authToken
	)
}
