import { Tag } from './tag';

export enum OrderBy {
  Youngest = 'youngest',
  Oldest = 'oldest',
  Ditstance = 'distance',
  CommonTags = 'common_tags',
}

export interface Filter {
  max_dist: number;
  min_age: number;
  max_age: number;
  common_tags: Tag[];
  order_by: OrderBy;
  offset: number;
}
