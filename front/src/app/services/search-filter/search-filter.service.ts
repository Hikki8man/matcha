import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { FiltersModel } from 'src/app/models/filters.model';
import { ISearchFilterService } from './isearch-filter.service';

@Injectable({
    providedIn: 'root',
})
export class SearchFilterService implements ISearchFilterService {
    private filtersSubject = new BehaviorSubject<FiltersModel>(new FiltersModel());
    public filters$ = this.filtersSubject.asObservable();

    public updateFilters(filters: FiltersModel): void {
        this.filtersSubject.next(filters);
    }

    public get filters(): Observable<FiltersModel> {
        return this.filters$;
    }
}
