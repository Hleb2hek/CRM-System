import { useState, useEffect } from 'react';

import Header from "./components/Header";
import Tasks from "./components/Tasks";

import { postUserTasks, fetchAllTasks } from "./api/http";

function App() {

	const [tasks, setTasks] = useState([]);
	const [newTask, setNewTask] = useState("");
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	async function createTasks() {

		if(error) return;

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
				setNewTask(false)
			}
			finally {
				setLoading(false)
			}
		}
		getTasks()
	}, []);

	return (
		<>
			<Header error={error} setNewTask={setNewTask} createTasks={createTasks} />
			<Tasks error={error} tasks={tasks} loading={loading} />
		</>
	)

}

export default App
