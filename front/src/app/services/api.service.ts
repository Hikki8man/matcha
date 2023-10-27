import { HttpClient } from '@angular/common/http';
import { IApiService } from './iapi.service';
import { environment } from 'src/environment/environment';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class ApiService implements IApiService {

    constructor(
        private readonly _http: HttpClient,
    ) { }

    public async callApi<T>(url: string, method: string, body?: any): Promise<T> {
        const req = this._http.request<T>(method, environment.apiBaseUrl + url, { body });

        return new Promise<T>((resolve, reject) => {

            const onComplete: (data: any) => void = (data: any) => {
                resolve(data);
            };

            const onError: (error: any) => void = error => {
                reject(error);
            };

            req.subscribe({
                next: data => onComplete(data),
                error: error => onError(error),
            });
        });
    }
}