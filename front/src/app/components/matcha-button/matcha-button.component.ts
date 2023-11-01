import { HttpClient } from '@angular/common/http';
import { Component, Input } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IconUrlEnum } from 'src/app/enums/icon-url-enum';
import { AccountData } from 'src/app/models/account.model';
import { ProfileData } from 'src/app/models/profile.model';
import { AuthService, Credentials } from 'src/app/services/auth.sevice';

@Component({
    selector: 'matcha-button',
    templateUrl: './matcha-button.component.html',
    styleUrls: ['./matcha-button.component.scss'],
})
export class MatchaButtonComponent {
    @Input() Disabled: boolean = false;
    @Input() Label: string = '';
    @Input() Type: string = 'submit';
}
