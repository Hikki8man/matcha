import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchFiltersComponent } from './search-filters.component';
import { MatSliderModule } from '@angular/material/slider';
import { InterestTagModule } from '../interest-tag/interest-tag.module';
import { SelectTagsButtonModule } from '../select-tags-button/select-tags-button.module';

@NgModule({
    declarations: [SearchFiltersComponent],
    imports: [CommonModule, MatSliderModule, InterestTagModule, SelectTagsButtonModule],
    exports: [SearchFiltersComponent],
})
export class SearchFiltersModule {}
