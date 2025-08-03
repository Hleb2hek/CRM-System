import { useState, useEffect } from 'react';

import Header from "./components/Header";
import Tasks from "./components/Tasks";

import { postUserTasks, fetchAllTasks } from "./api/http";

function App() {

	const [tasks, setTasks] = useState([]);
	const [newTask, setNewTask] = useState("");
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState();

	async function createTasks() {
		try {
			const createdTask = await postUserTasks(newTask);
			setTasks(t => [...t, createdTask,]);
		} catch (error) {
			console.log(error);
		}
	}

	useEffect(() => {
		async function getTasks() {
			try {
				const { data, info } = await fetchAllTasks()
				setTasks(data)
			}
			catch (error) {
				console.log(error);
			}
			finally {
				setLoading(false)
			}
		}
		getTasks()
	}, []);

	return (
		<>
			<Header setNewTask={setNewTask} createTasks={createTasks} />
			<Tasks tasks={tasks} loading={loading} />
		</>
	)

}

export default App
