import { Component } from '@angular/core';
import { FiltersModel } from 'src/app/models/filters.model';

@Component({
	selector: 'search-filters',
	templateUrl: './search-filters.component.html',
	styleUrls: ['./search-filters.component.scss']
})
export class SearchFiltersComponent {

	public Filters: FiltersModel = new FiltersModel();

	public formatAgeLabel(value: number) {
		if (value === 60) {
			return '60+';
		}
		return value.toString();
	}

	public formatDistanceLabel(value: number) {
		if (value === 100) {
			return '100+km';
		} else {
			return  `${value.toString()}km`;
		}
	}

	public handleFiltersUpdate() {
		console.log('filters updated !')
	}
}
