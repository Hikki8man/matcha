import { Component, ViewChild } from '@angular/core';
import { MatStepper } from '@angular/material/stepper';
import { IconUrlEnum } from 'src/app/enums/icon-url-enum';

@Component({
	selector: 'app-profile-complete',
	templateUrl: './profile-complete.component.html',
	styleUrls: ['./profile-complete.component.scss']
})
export class ProfileCompleteComponent {

	@ViewChild('stepper') stepper: MatStepper;
	public HeartIconUrl: string = IconUrlEnum.Heart;
    public HeartIconStyle: Record<string, string> = {
        display: 'flex',
        height: '24px',
        width: '24px',
    };
}
