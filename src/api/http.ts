import { MetaResponse, Todo, TodoInfo, TodoRequest } from "../models/todo";

// Запрос на отправку таски
export async function postUserTasks(task: string): Promise<Todo> {
	const response = await fetch("https://easydev.club/api/v1/todos", {
		method: "POST",
		body: JSON.stringify({ title: task }),
		headers: {
			'Content-Type': 'application/json'
		},
	})

	if (!response.ok) {
		throw new Error(`Ошибка отправки данных`)
	}

	const resData: Todo = await response.json();
	return resData
}
// Запрос на удаление
export async function deleteTaskFetch(id: number): Promise<boolean> {
	const response = await fetch(`https://easydev.club/api/v1/todos/${id}`, {
		method: "DELETE",
		headers: {
			'accept': 'application/json'
		},
	})

	if (!response.ok) {
		throw new Error(`Ошибка удаления`)
	}

	return true
}
// Запрос на редактирование
export async function editTaskFetch(id: number, todoRequest: TodoRequest): Promise<Todo> {
	const response = await fetch(`https://easydev.club/api/v1/todos/${id}`, {
		method: "PUT",
		body: JSON.stringify(todoRequest),
		headers: {
			'Content-Type': 'application/json'
		},
	})

	if (!response.ok) {
		throw new Error(`Ошибка редактирования`)
	}

	const resData: Todo = await response.json();
	return resData
}

// Запрос на список
export async function fetchFilter(filter: string = 'all'): Promise<MetaResponse<Todo, TodoInfo>> {
	const response = await fetch(`https://easydev.club/api/v1/todos?filter=${filter}`);

	if (!response.ok) {
		throw new Error(`Не удаётся связаться с сервером`)
	}

	const jsonData: MetaResponse<Todo, TodoInfo> = await response.json();

	return jsonData

}
