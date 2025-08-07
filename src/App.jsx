import { useState, useEffect } from 'react';

import Header from "./components/Header/Header";
import Tasks from "./components/Tasks/Tasks";

import { postUserTasks, fetchAllTasks } from "./api/http";

function App() {

	const [tasks, setTasks] = useState([]);
	const [newTask, setNewTask] = useState("");
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	async function createTasks() {

		// Если ощибка висит, завершаем работу функции
		if (error) return;

		try {
			const createdTask = await postUserTasks(newTask);
			setTasks(t => [...t, createdTask]);
			setNewTask("")
		} catch (error) {
			setError(error.message)
		}
	}

	useEffect(() => {
		async function getTasks() {
			try {
				const { data } = await fetchAllTasks()
				setTasks(data)
			}
			catch (error) {
				setError(error)
				setNewTask("")
			}
			finally {
				setLoading(false)
			}
		}
		getTasks()
	}, []);

	return (
		<>
			<Header value={newTask} newTask={newTask} setNewTask={setNewTask} createTasks={createTasks} />
			<Tasks error={error} tasks={tasks} setTasks={setTasks} loading={loading} />
		</>
	)

}

export default App
