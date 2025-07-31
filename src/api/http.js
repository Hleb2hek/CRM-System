export async function fetchAllTasks() {
	const response = await fetch("https://easydev.club/api/v1/todos");
	const jsonData = await response.json();

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

	const resData = await response.json();
	return resData

}
