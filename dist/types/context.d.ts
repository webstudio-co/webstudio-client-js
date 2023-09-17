import React from 'react';
export interface ApiContextType {
    api: any;
    baseURL: string;
}
export declare type ApiProviderProps = {
    url: string;
    children: React.ReactNode;
    fetchToken: () => Promise<string>;
};
