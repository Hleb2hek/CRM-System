export async function fetchAllTasks() {
	try {
		const response = await fetch("https://easydev.club/api/v1/todos");
		const jsonData = await response.json();

		if (!response.ok) {
			throw new Error(`Ошибка ${response.status}`)
		}

		return jsonData
	} catch (error) {
		console.error(error);
	}
}

export async function postUserTasks(task) {
	try {
		const response = await fetch("https://easydev.club/api/v1/todos", {
			method: "POST",
			body: JSON.stringify({ title: task }),
			headers: {
				'Content-Type': 'application/json'
			},
		})

		if (!response.ok) {
			throw new Error(`Ошибка ${response.status}`)
		}

		const resData = await response.json();
		return resData

	} catch (error) {
		console.error(error);
	}


}
