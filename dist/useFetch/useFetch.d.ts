export declare const fetchData: (url: string, params: Object, abortController: AbortController) => Promise<Response | Error>;
declare const useFetch: (url: string, getData: typeof fetchData, params?: Object) => {
    idle: boolean;
    pending: boolean;
    resolved: boolean;
    rejected: boolean;
    data: any;
    error: Error | null;
};
export default useFetch;
