import { QueryParams } from '../types/query';
import { ConfigParams, ExecuteResponse } from '../types/client';
export declare class ApiClient {
    private payload?;
    private _path?;
    private _collection;
    private endpoint?;
    private headers;
    private apiQuery;
    private restClient;
    constructor(baseURL: string | null, fetchToken: () => string | null, apiKey?: string | null, authToken?: string | null);
    config(params: ConfigParams): this;
    url(path: string): ApiClient;
    collection(collection: string): ApiClient;
    setDefaults(): ApiClient;
    query(params: QueryParams): ApiClient;
    eq(field: string, value: string | number): ApiClient;
    neq(field: string, value: string | number): ApiClient;
    gt(field: string, value: string | number): ApiClient;
    gte(field: string, value: string | number): ApiClient;
    lt(field: string, value: string | number): ApiClient;
    lte(field: string, value: string | number): ApiClient;
    in(field: string, value: string | number): ApiClient;
    nin(field: string, value: string | number): ApiClient;
    sort(field: string, direction: 'asc' | 'desc'): ApiClient;
    search(query: string): this;
    filter(filters: any): this;
    page(page: number): this;
    per(perPage: number): this;
    findOne(id: number): Promise<ExecuteResponse>;
    findMany(searchParams: QueryParams): Promise<ExecuteResponse>;
    create(data: Record<string, any>): Promise<ExecuteResponse>;
    update(data: Record<string, any>): Promise<ExecuteResponse>;
    destroy(id: number): Promise<ExecuteResponse>;
    updatePositions(sorted: Record<string, any>[]): Promise<ExecuteResponse>;
    updateMany(ids: number[], resource: object): Promise<ExecuteResponse>;
    destroyMany(ids: number[]): Promise<ExecuteResponse>;
    publish(id: number): Promise<ExecuteResponse>;
    unpublish(id: number): Promise<ExecuteResponse>;
    addLinks(sourceId: number, contentType: string, targetIds: number[]): Promise<ExecuteResponse>;
    removeLinks(sourceId: number, targetIds: number[]): Promise<ExecuteResponse>;
    addAttachment(id: number, name: string, attachmentId: number): Promise<ExecuteResponse>;
    removeAttachment(id: number, name: string, attachmentId: number): Promise<ExecuteResponse>;
    parseURL(routerParams: any): this;
    get(endpoint: string, params?: string): Promise<ExecuteResponse>;
    post(endpoint: string, payload: object): Promise<ExecuteResponse>;
    put(endpoint: string, payload: object): Promise<ExecuteResponse>;
    delete(endpoint: string): Promise<ExecuteResponse>;
    handleMultipartData(): void;
}
export declare const createClient: (baseURL: string, fetchToken: () => any, apiKey?: string | null, authToken?: string | null) => ApiClient;
