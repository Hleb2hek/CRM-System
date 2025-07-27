export async function fetchAllTasks() {
	const response = await fetch("https://easydev.club/api/v1/todos");
	const jsonData = await response.json();

	return jsonData
}