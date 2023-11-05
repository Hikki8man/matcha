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

    // public async callApi<T>(url: string, method: string, body?: any): Promise<T> {
    //     const req = this._http.request<T>(method, environment.apiBaseUrl + '/' + url, {
    //         body,
    //         withCredentials: true,
    //     });

    //     return new Promise<T>((resolve, reject) => {
    //         const onComplete: (data: any) => void = (data: any) => {
    //             resolve(data);
    //         };

    //         const onError: (error: any) => void = (error) => {
    //             console.log('callapi error', error);
    //             reject(error);
    //         };

    //         req.subscribe({
    //             next: (data) => onComplete(data),
    //             error: (error) => onError(error),
    //         });
    //     });
    // }

    public callApi<T>(url: string, method: string, body?: any): Observable<T> {
        const req = this._http.request<T>(method, environment.apiBaseUrl + '/' + url, {
            body,
            withCredentials: true,
        });

        return req;
    }

    public callApiAvatar<T>(url: string): Observable<T> {
        const req = this._http.get<T>(environment.apiBaseUrl + '/' + url, {
            withCredentials: true,
            responseType: 'blob' as 'json', // Set the responseType to 'blob'
        });

        return req;
    }
}
