import { check } from './check';

export const params = (field: string) => check(field, 'params');
