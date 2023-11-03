export abstract class IApiService {
    public abstract callApi<T>(url: string, method: string, body?: any): Promise<T>;
    public abstract callApiAvatar<T>(url: string): Promise<T>;
}
