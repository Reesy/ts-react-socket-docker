

export interface IRequestOptions
{
    baseUrl?: string;
    host?: string;
    port?: number;
    method?: string;
    headers?: any;
    body?: any;
    encoding?: string | null;
    timeout?: number
}