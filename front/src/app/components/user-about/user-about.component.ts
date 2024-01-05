import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { GenderEnum } from 'src/app/enums/gender-enum';
import { SexualOrientation } from 'src/app/enums/sexual-orientation-enum';
import { About, ProfileCardModel, PublicProfileModel } from 'src/app/models/profile.model';

@Component({
    selector: 'user-about',
    templateUrl: './user-about.component.html',
    styleUrls: ['./user-about.component.scss'],
})
export class UserAboutComponent implements OnInit, OnChanges {
    @Input() public ProfileCard: ProfileCardModel;

    public About: About;
    public Profile: PublicProfileModel;

    private _orientations = {
        [SexualOrientation.Heterosexual]: 'Hétérosexuel',
        [SexualOrientation.Homosexual]: 'Homosexuel',
        [SexualOrientation.Bisexual]: 'Bisexuel',
    };

    private _genders = {
        [GenderEnum.Male]: 'Homme',
        [GenderEnum.Female]: 'Femme',
        [GenderEnum.Other]: 'Autre',
    };

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['ProfileCard'] && changes['ProfileCard'].currentValue) {
            this.Profile = this.ProfileCard.profile;
            this.About = this.ProfileCard.about;
        }
    }

    ngOnInit(): void {
        if (this.ProfileCard) {
            this.Profile = this.ProfileCard.profile;
            this.About = this.ProfileCard.about;
        }
    }

    public getFameRating(): string {
        return this.Profile.fame_rating.toFixed(2);
    }

    public getOrientation(): string {
        return this._orientations[this.Profile.sexual_orientation];
    }

    public getGender(): string {
        return this._genders[this.Profile.gender];
    }
}
