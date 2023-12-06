import { HttpClient } from '@angular/common/http';
import { IApiService } from './iapi.service';
import { environment } from 'src/environment/environment';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class ApiService implements IApiService {
    constructor(private readonly _http: HttpClient) {}

    public callApi<T>(url: string, method: string, body?: any): Observable<T> {
        return this._http.request<T>(method, environment.apiBaseUrl + '/' + url, {
            body,
        });
    }

    public callApiWithCredentials<T>(url: string, method: string, body?: any): Observable<T> {
        return this._http.request<T>(method, environment.apiBaseUrl + '/' + url, {
            body,
            withCredentials: true,
        });
    }

    public callApiAvatar<T>(url: string): Observable<T> {
        return this._http.get<T>(environment.apiBaseUrl + '/' + url, {
            responseType: 'blob' as 'json', // Set the responseType to 'blob'
        });
    }
}
