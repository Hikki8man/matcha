import { Observable } from 'rxjs';

export interface LikeModel {
    id: number;
    name: string;
    created_at: Date;
    avatar: Observable<string>;
    time_ago: string;
}
