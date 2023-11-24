import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-user',
    templateUrl: './user.component.html',
    styleUrls: ['./user.component.scss'],
})
export class UserComponent {

    public UserId: number;

    constructor(
        private readonly _route: ActivatedRoute
    ) {
        this.UserId = this._route.snapshot.params['id'];        
        
    }
}
