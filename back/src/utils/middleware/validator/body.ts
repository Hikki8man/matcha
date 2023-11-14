import { check } from './check';

export const body = (field: string) => check(field, 'body');
