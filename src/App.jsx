import { useState, useEffect } from 'react';

import Header from "./components/Header/Header";
import Tasks from "./components/Tasks/Tasks";

import { postUserTasks, fetchAllTasks } from "./api/http";

function App() {

	const [tasks, setTasks] = useState([]);
	const [newTask, setNewTask] = useState("");
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

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
			<Header error={error} setError={setError} setTasks={setTasks} setNewTask={setNewTask} newTask={newTask} />
			<Tasks error={error} setError={setError} tasks={tasks} setTasks={setTasks} loading={loading} />
		</>
	)

}

export default App
