export declare type ConfigParams = {
    collection?: string;
    path?: string;
};
export declare type ExecuteResponse = {
    data: any;
    error: any;
};
export declare type QueryProps = {
    url: string;
    name: string;
    skip?: boolean;
};
export declare type Resource = Record<string, any> & {
    id?: string;
};
export declare type PageInfo = {
    page: number;
    per_page: number;
    total_count: number;
    num_pages: number;
};
export declare type MutationParams = {
    url: string;
    name: string;
};
