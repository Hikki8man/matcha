import { Injectable } from '@angular/core';
import { GenderEnum } from '../../enums/gender-enum';
import { Tag } from '../../models/profile.model';
import { IApiService } from '../api/iapi.service';
import { IProfileService } from './iprofile.service';

@Injectable({
    providedIn: 'root',
})
export class ProfileService implements IProfileService {
    constructor(private _apiService: IApiService) {}

    public editName(name: string): Promise<void> {
        return this._apiService.callApi('profile/edit/name', 'POST', { name });
    }

    public editGender(gender: GenderEnum): Promise<void> {
        return this._apiService.callApi('profile/edit/gender', 'POST', { gender });
    }

    public editAvatar(file: File): Promise<void> {
        const formData = new FormData();
        formData.append('photo', file);
        return this._apiService.callApi('profile/edit/avatar', 'POST', formData);
    }

    public async getAvatar(id: number): Promise<string> {
        const avatar = await this._apiService.callApiAvatar<Blob>(`profile/${id}/avatar`);
        return URL.createObjectURL(avatar);
    }

    public async getAllTags(): Promise<Tag[]> {
        return await this._apiService.callApi<Tag[]>('tags', 'GET');
    }

    public async editTags(tags: Tag[]): Promise<void> {
        return await this._apiService.callApi('edit/tags', 'POST', { tags });
    }

    public editBio(bio: string): Promise<void> {
        return this._apiService.callApi('profile/edit/bio', 'POST', { bio });
    }
}
