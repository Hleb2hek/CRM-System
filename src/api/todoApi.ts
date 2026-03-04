import { Filter, MetaResponse, Todo, TodoInfo, TodoRequest } from '../types/todo';
import { httpClient } from './index';

export async function addUserTodo(task: string): Promise<Todo> {
	const response = await httpClient.post<Todo>('/todos', {
		title: task,
	});
	return response.data;
}
export async function deleteUserTodo(id: number): Promise<void> {
	await httpClient.delete(`/todos/${id}`);
}
export async function editUserTodo(id: number, todoRequest: TodoRequest): Promise<Todo> {
	const response = await httpClient.put<Todo>(`/todos/${id}`, todoRequest);
	return response.data;
}

export async function getTodosByFilter(
	filter: Filter = 'all',
): Promise<MetaResponse<Todo, TodoInfo>> {
	const response = await httpClient.get<MetaResponse<Todo, TodoInfo>>('/todos', {
		params: { filter },
	});
	return response.data;
}
