import { Observable } from 'rxjs';

export enum LikeType {
    Like,
    Unlike,
}

export interface LikeEvent {
    user: {
        id: number;
        name: string;
        created_at: Date;
        avatar: Observable<string>;
        time_ago: string;
    };
    type: LikeType;
}
