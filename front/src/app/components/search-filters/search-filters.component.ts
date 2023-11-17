import { Component } from '@angular/core';
import { FiltersModel } from 'src/app/models/filters.model';
import { ISearchFilterService } from 'src/app/services/search-filter/isearch-filter.service';

@Component({
    selector: 'search-filters',
    templateUrl: './search-filters.component.html',
    styleUrls: ['./search-filters.component.scss'],
})
export class SearchFiltersComponent {
    constructor(private _searchFilterService: ISearchFilterService) {}

    public Filters: FiltersModel = new FiltersModel();

    public formatAgeLabel(value: number) {
        if (value === 60) {
            return '60+';
        }
        return value.toString();
    }

    public formatDistanceLabel(value: number) {
        if (value === 1000) {
            return '1000+km';
        } else if (value === 0) {
            return '<1km';
        } else {
            return `${value.toString()}km`;
        }
    }

    public handleFiltersUpdate() {
        this._searchFilterService.updateFilters(this.Filters);
    }
}
