import { Observable } from 'rxjs';
import { FiltersModel } from 'src/app/models/filters.model';

export abstract class ISearchFilterService {
    abstract updateFilters(filters: FiltersModel): void;
    abstract get filters(): Observable<FiltersModel>;
}