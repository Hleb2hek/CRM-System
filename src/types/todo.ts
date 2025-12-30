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

export interface MetaResponse<T, N> {
	data: T[];
	info?: N;
	meta: {
		totalAmount: number;
	};
}

export type Filter = 'all' | 'completed' | 'inWork';

export interface MenuItem {
	key: string;
	icon: ReactNode;
	label: string;
	path: string;
}
