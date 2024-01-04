import { Component, Input } from '@angular/core';
import { FiltersModel } from 'src/app/models/filters.model';
import { ISearchFilterService } from 'src/app/services/search-filter/isearch-filter.service';

@Component({
    selector: 'pagination',
    templateUrl: './pagination.component.html',
    styleUrls: ['./pagination.component.scss'],
})
export class PaginationComponent {
    @Input() public ItemsPerPage: number;
    @Input() public ItemCount: number;
    private _filters: FiltersModel;

    constructor(private readonly _filterService: ISearchFilterService) {
        this._filterService.filters.subscribe((filter) => (this._filters = filter));
    }

    public previousPage(): void {
        if (!this.isFirstPage()) {
            this._filters.Offset -= this.ItemsPerPage;
            this._filterService.updateFilters(this._filters);
        }
    }

    public nextPage(): void {
        if (!this.isLastPage()) {
            this._filters.Offset += this.ItemsPerPage;
            this._filterService.updateFilters(this._filters);
        }
    }

    public isLastPage(): boolean {
        return this._filters.Offset >= this.ItemCount - this.ItemsPerPage;
    }

    public isFirstPage(): boolean {
        return this._filters.Offset === 0;
    }
}
