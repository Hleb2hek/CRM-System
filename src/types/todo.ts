import { ReactNode } from 'react';

export interface Todo {
	id: number;
	title: string;
	created: string;
	isDone: boolean;
}

export type TodoRequest = Partial<Pick<Todo, 'title' | 'isDone'>>;

export interface TodoInfo {
	all: number;
	completed: number;
	inWork: number;
}

export interface MetaResponse<T, N = {}> {
	data: T[];
	info?: N;
	meta: {
		totalAmount: number;
		sortBy?: string;
		sortOrder?: 'asc' | 'desc';
	};
}

export type Filter = 'all' | 'completed' | 'inWork';

export interface AddTodoProps {
	refreshTasks: () => void;
}

export interface MenuItem {
	key: string;
	icon: ReactNode;
	label: string;
	path: string;
}

export interface TabListProps {
	setFilter: (filter: Filter) => void;
	tabs: TodoInfo;
	filter: Filter;
}

export interface TaskItemProps {
	id: number;
	title: string;
	isDone: boolean;
	setError: (arg: Error | null) => void;
	refreshTasks: () => void;
}

export interface TodoListProps {
	filter: Filter;
	tasks: Todo[];
	refreshTasks: () => void;
	setError: (arg: Error | null) => void;
}
