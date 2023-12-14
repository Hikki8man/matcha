import { Component, ViewChild } from '@angular/core';
import { MatStepper } from '@angular/material/stepper';
import { IconUrlEnum } from 'src/app/enums/icon-url-enum';

@Component({
    selector: 'app-complete-profile',
    templateUrl: './complete-profile.component.html',
    styleUrls: ['./complete-profile.component.scss']
})
export class CompleteProfileComponent {

    @ViewChild('stepper') stepper: MatStepper;
    public HeartIconUrl: string = IconUrlEnum.Heart;
    public HeartIconStyle: Record<string, string> = {
        display: 'flex',
        height: '24px',
        width: '24px',
    };

    public handleValidateStep(id: number): void {
        this.stepper.steps.get(id).completed = true;
        this.stepper.next();
    }
}
