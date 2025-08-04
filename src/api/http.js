export async function fetchAllTasks() {
	const response = await fetch("https://easydev.club/api/v1/todosы");
	const jsonData = await response.json();

	if (!response.ok) {
		throw new Error(`Неудаёться связаться с сервером`)
	}

	return jsonData
}

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
