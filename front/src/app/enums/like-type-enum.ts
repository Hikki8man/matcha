export enum LikeType {
    Like,
    Unlike,
}

export interface LikeEvent {
    user: {
        id: number;
        name: string;
        created_at: Date;
        avatar: string;
        time_ago: string;
    };
    type: LikeType;
}
