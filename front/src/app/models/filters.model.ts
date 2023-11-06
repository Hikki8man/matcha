import { Tag } from './profile.model';

export class FiltersModel {
    public MinAge: number = 18;
    public MaxAge: number = 40;

    public DistanceRange: number = 5;

    public MinFameRating: number = 0;
    public MaxFameRating: number = 10;

    public Tags: Tag[] = [
        { id: 1, name: 'Test' },
        { id: 2, name: 'Test2' },
        { id: 3, name: 'Test3' },
    ];
}
