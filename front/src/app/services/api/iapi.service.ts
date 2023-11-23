import { Observable } from 'rxjs';

export abstract class IApiService {
    public abstract callApi<T>(url: string, method: string, body?: any): Observable<T>;
    public abstract callApiWithCredentials<T>(
        url: string,
        method: string,
        body?: any,
    ): Observable<T>;
    public abstract callApiAvatar<T>(url: string): Observable<T>;
}
