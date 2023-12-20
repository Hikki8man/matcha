import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { AppPathEnum } from 'src/app/enums/app-path-enum';
import { IApiService } from 'src/app/services/api/iapi.service';

@Component({
    selector: 'app-verify-account',
    templateUrl: './verify-account.component.html',
})
export class VerifyAccountComponent implements OnInit {
    private _token: string;

    constructor(
        private readonly _route: ActivatedRoute,
        private readonly _apiService: IApiService,
        private readonly _toastService: HotToastService,
        private readonly _router: Router,
    ) {}

    ngOnInit() {
        console.log('VerifyAccountComponent');
        this._route.params.subscribe((params) => {
            if (params['token']) {
                this._token = params['token'];
                this._apiService
                    .callApi('auth/verify-account', 'POST', { token: this._token })
                    .subscribe({
                        error: (_) => {
                            this._toastService.error('Error verifying account!');
                            this._router.navigate([AppPathEnum.Login]);
                        },
                        complete: () => {
                            this._toastService.success('Account verified!');
                            this._router.navigate([AppPathEnum.Login]);
                        },
                    });
            }
        });
    }
}
