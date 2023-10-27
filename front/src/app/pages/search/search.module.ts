import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchComponent } from './search.component';
import { UserListModule } from 'src/app/components/user-list/user-list.module';
import { SearchFiltersModule } from 'src/app/components/search-filters/search-filters.module';



@NgModule({
	declarations: [
		SearchComponent
	],
	imports: [
		CommonModule,
		UserListModule,
		SearchFiltersModule
	],
	exports: [
		SearchComponent
	]
})
export class SearchModule { }
