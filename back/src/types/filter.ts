import { Tag } from './tag';

export enum OrderBy {
  Youngest = 'youngest',
  Oldest = 'oldest',
  Ditstance = 'distance',
  CommonTags = 'common_tags',
  FameRating = 'fame_rating',
}

export interface Filter {
  max_dist: number;
  min_age: number;
  max_age: number;
  min_fame: number;
  max_fame: number;
  common_tags: Tag[];
  order_by: OrderBy;
  offset: number;
}
