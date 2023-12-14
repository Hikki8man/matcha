import { Component, ViewChild } from '@angular/core';
import { MatStepper } from '@angular/material/stepper';
import { IconUrlEnum } from 'src/app/enums/icon-url-enum';
import { ICompleteProfileService } from 'src/app/services/complete-profile/icomplete-profile.service';

@Component({
    selector: 'app-complete-profile',
    templateUrl: './complete-profile.component.html',
    styleUrls: ['./complete-profile.component.scss'],
})
export class CompleteProfileComponent {
    @ViewChild('stepper') stepper: MatStepper;
    public HeartIconUrl: string = IconUrlEnum.Heart;
    public HeartIconStyle: Record<string, string> = {
        display: 'flex',
        height: '24px',
        width: '24px',
    };

    constructor(private readonly _completeService: ICompleteProfileService) {}

    public handleValidateStep(id: number): void {
        const obs =
            id === 0
                ? this._completeService.completeFirstStep()
                : this._completeService.completeSecondStep();

        obs.subscribe({
            next: (_) => {
                this.stepper.steps.get(id).completed = true;
                this.stepper.next();
            },
        });
    }
}
