// Запрос на все таски
export async function fetchAllTasks() {
	try {
		const response = await fetch("https://easydev.club/api/v1/todos");

		if (!response.ok) {
			throw new Error(`Не удаётся связаться с сервером`)
		}

		const jsonData = await response.json();

		return await jsonData
	} catch (error) {
		throw error
	}
}
// Запрос на отправку таски
export async function postUserTasks(task) {
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

	const resData = await response.json();
	return resData
}
// Запрос на удаление
export async function deleteTaskFetch(id) {
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
export async function editTaskFetch(id, task) {
	const response = await fetch(`https://easydev.club/api/v1/todos/${id}`, {
		method: "PUT",
		body: JSON.stringify({ title: task }),
		headers: {
			'Content-Type': 'application/json'
		},
	})

	if (!response.ok) {
		throw new Error(`Ошибка редактирования`)
	}

	const resData = await response.json();
	return resData
}
// Запрос на отметку
export async function checkboxTaskFetch(id, done) {
	const response = await fetch(`https://easydev.club/api/v1/todos/${id}`, {
		method: "PUT",
		body: JSON.stringify({ isDone: done }),
		headers: {
			'Content-Type': 'application/json'
		},
	})

	if (!response.ok) {
		throw new Error(`Ошибка отметки`)
	}

	const resData = await response.json();
	return resData
}
// Запрос на список
export async function fetchFilter(filter = 'all') {
	try {
		const response = await fetch(`https://easydev.club/api/v1/todos?filter=${filter}`);

		if (!response.ok) {
			throw new Error(`Не удаётся связаться с сервером`)
		}

		const jsonData = await response.json();

		return await jsonData
	} catch (error) {
		throw error
	}
}
