import { ExecuteResponse } from '../types/client';
export declare class RestClient {
    private method?;
    private payload?;
    private params?;
    private authToken?;
    private apiKey?;
    private options;
    private baseURL;
    private fetchToken;
    constructor(baseURL: string | null, fetchToken: () => string | null, apiKey?: string | null, authToken?: string | null);
    get(endpoint: string, params?: string, headers?: Record<string, any> | null): Promise<ExecuteResponse>;
    put(endpoint: string, payload: object, headers?: Record<string, any> | null): Promise<ExecuteResponse>;
    post(endpoint: string, payload?: object, headers?: Record<string, any> | null): Promise<ExecuteResponse>;
    delete(endpoint: string): Promise<ExecuteResponse>;
    execute(endpoint?: string): Promise<ExecuteResponse>;
}
