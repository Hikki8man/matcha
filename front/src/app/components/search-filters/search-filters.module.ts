import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchFiltersComponent } from './search-filters.component';
import { MatSliderModule } from '@angular/material/slider';
import { InterestTagModule } from '../interest-tag/interest-tag.module';

@NgModule({
    declarations: [SearchFiltersComponent],
    imports: [CommonModule, MatSliderModule, InterestTagModule],
    exports: [SearchFiltersComponent],
})
export class SearchFiltersModule {}
