import axios, { AxiosError } from 'axios';
import { Filter, MetaResponse, Todo, TodoInfo, TodoRequest } from '../types/todo';
import { instance } from './index';

// Запрос на отправку таски
export async function addUserTodo(task: string): Promise<Todo> {
	try {
		const response = await instance.post<Todo>('/todos', {
			title: task,
		});
		console.log(response);
		return response.data;
	} catch (error) {
		if (axios.isAxiosError(error)) {
			throw error;
		}
		throw new Error('Неизвестная ошибка');
	}
}
// Запрос на удаление
export async function deleteUserTodo(id: number): Promise<void> {
	try {
		await instance.delete(`/todos/${id}`);
	} catch (error) {
		throw new AxiosError(`Ошибка удаления`);
	}
}
// Запрос на редактирование
export async function editUserTodo(id: number, todoRequest: TodoRequest): Promise<Todo> {
	try {
		const response = await instance.put<Todo>(`/todos/${id}`, todoRequest);
		return response.data;
	} catch (error) {
		throw new AxiosError(`Ошибка редактирования`);
	}
}

// Запрос на список
export async function getTodosByFilter(
	filter: Filter = 'all',
): Promise<MetaResponse<Todo, TodoInfo>> {
	try {
		const response = await instance.get<MetaResponse<Todo, TodoInfo>>('/todos', {
			params: { filter },
		});
		return response.data;
	} catch (error) {
		throw new AxiosError(`Не удаётся связаться с сервером`);
	}
}
