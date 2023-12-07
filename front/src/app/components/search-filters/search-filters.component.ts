import { Component } from '@angular/core';
import { OrderBy } from 'src/app/enums/order-by-enum';
import { FiltersModel } from 'src/app/models/filters.model';
import { Tag } from 'src/app/models/profile.model';
import { ISearchFilterService } from 'src/app/services/search-filter/isearch-filter.service';

@Component({
    selector: 'search-filters',
    templateUrl: './search-filters.component.html',
    styleUrls: ['./search-filters.component.scss'],
})
export class SearchFiltersComponent {
    constructor(private _searchFilterService: ISearchFilterService) {
        const filters = localStorage.getItem('filters');
        if (filters) {
            this.Filters = JSON.parse(filters);
            this.handleFiltersUpdate();
        }
    }

    public Filters: FiltersModel = new FiltersModel();
    public OrderByEnum = OrderBy;

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

    public setOrderBy(order: OrderBy) {
        this.Filters.OrderBy = order;
        this.handleFiltersUpdate();
    }

    public setTags(tags: Tag[]) {
        this.Filters.Tags = tags;
        this.handleFiltersUpdate();
    }

    public handleFiltersUpdate() {
        localStorage.setItem('filters', JSON.stringify(this.Filters));
        this._searchFilterService.updateFilters(this.Filters);
    }
}
