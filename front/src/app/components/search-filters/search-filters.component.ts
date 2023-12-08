import { Component, HostListener, OnInit } from '@angular/core';
import { IconUrlEnum } from 'src/app/enums/icon-url-enum';
import { OrderBy } from 'src/app/enums/order-by-enum';
import { FiltersModel } from 'src/app/models/filters.model';
import { Tag } from 'src/app/models/profile.model';
import { ISearchFilterService } from 'src/app/services/search-filter/isearch-filter.service';

@Component({
    selector: 'search-filters',
    templateUrl: './search-filters.component.html',
    styleUrls: ['./search-filters.component.scss'],
})
export class SearchFiltersComponent implements OnInit {

    public Filters: FiltersModel = new FiltersModel();
    public OrderByEnum = OrderBy;
    public IsMobileView: boolean = false;
    public IsExpand: boolean = false;

    public IconExpandUrl: string = IconUrlEnum.ExpandMore;
    public IconExpandStyle: Record<string, string> = { 'width': '24px', 'height': '24px', display: 'flex' };

    constructor(private _searchFilterService: ISearchFilterService) {
        const filters = localStorage.getItem('filters');
        if (filters) {
            this.Filters = JSON.parse(filters);
            this.handleFiltersUpdate();
        }
    }

    ngOnInit(): void {
        this.IsMobileView = window.innerWidth <= 1050;
    }

    public toggleExpand() {
        this.IsExpand = !this.IsExpand;
    }

    @HostListener('window:resize', ['$event'])
    public handleResize(event: any) {
        this.IsMobileView = event.target.innerWidth <= 1050;
    }

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
