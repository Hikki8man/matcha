import { Observable } from 'rxjs';

export interface ProfileViewModel {
    id: number;
    name: string;
    created_at: Date;
    avatar: Observable<string>;
    time_ago: string;
}
