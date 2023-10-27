import { HttpClient } from '@angular/common/http';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
    selector: 'svg-icon',
    templateUrl: './svg-icon.component.html',
})
export class SvgIconComponent implements OnInit, OnDestroy {
    @Input()
    get Src(): string {
        return this._src;
    }
    set Src(src: string) {
        this._src = src;
        this.initSvgContent();
    }
    @Input() ContentStyle: Record<string, string>;

    public svg: SafeHtml;

    private _request: any;
    private _src: string;

    constructor(
        private readonly _sanitizer: DomSanitizer,
        private readonly _http: HttpClient
    ) { }

    ngOnInit() {
        this.initSvgContent();
    }

    public ngOnDestroy(): void {
        this._request?.unsubscribe();
    }

    public initSvgContent(): void {
        if (!this.Src) {
            return;
        }

        this._request?.unsubscribe();
        this._request = this._http.get(this.Src, { responseType: 'text' })
            .subscribe(logo => {
                this.svg = this._sanitizer.bypassSecurityTrustHtml(logo);
            });
    }
}