import { Filter, MetaResponse, Todo, TodoInfo, PartialTodoRequest } from '../models/todo';

import axios from 'axios';

const instance = axios.create({ baseURL: 'https://easydev.club/api/v1/todos' });

// Запрос на отправку таски
export async function addUserTodo(task: string): Promise<Todo> {
	try {
		const response = await instance.post<Todo>('', {
			title: task,
		});
		return response.data;
	} catch (error) {
		throw new Error(`Ошибка отправки данных`);
	}
}
// Запрос на удаление
export async function deleteUserTodo(id: number): Promise<void> {
	try {
		await instance.delete(`/${id}`);
	} catch (error) {
		throw new Error(`Ошибка удаления`);
	}
}
// Запрос на редактирование
export async function editUserTodo(id: number, todoRequest: PartialTodoRequest): Promise<Todo> {
	try {
		const response = await instance.put<Todo>(`/${id}`, todoRequest);
		return response.data;
	} catch (error) {
		throw new Error(`Ошибка редактирования`);
	}
}

// Запрос на список
export async function getTodosByFilter(
	filter: Filter = 'all',
): Promise<MetaResponse<Todo, TodoInfo>> {
	try {
		const response = await instance.get<MetaResponse<Todo, TodoInfo>>('', {
			params: { filter },
		});
		return response.data;
	} catch (error) {
		throw new Error(`Не удаётся связаться с сервером`);
	}
}
