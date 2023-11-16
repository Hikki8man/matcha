import { Tag } from './tag';

export enum OrderBy {
  AgeOlder = 'age_older',
  AgeYounger = 'age_younger',
  Ditstance = 'distance',
  CommonTags = 'common_tags',
}

export interface Filter {
  max_dist: number;
  common_tags: Tag[];
  order_by: OrderBy;
  offset: number;
}
