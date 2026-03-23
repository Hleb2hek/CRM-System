import { Filter } from '../types/todo';

export const filters: Filter[] = ['all', 'completed', 'inWork'];

export const isFilter = (key: string): key is Filter => {
	return filters.includes(key as Filter);
};
