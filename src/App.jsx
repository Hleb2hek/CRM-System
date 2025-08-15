import { useState, useEffect } from 'react';

import Header from "./components/Header/Header";
import Tabs from './components/Tabs/Tabs';
import Tasks from "./components/Tasks/Tasks";

import { fetchAllTasks, fetchFilter } from "./api/http";

function App() {

	const [tasks, setTasks] = useState([]);
	const [tabs, setTabs] = useState({
		all: 0,
		completed: 0,
		inWork: 0
	})
	const [newTask, setNewTask] = useState("");

	const [filter, setFilter] = useState("all")
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		async function getTasks() {
			try {
				const { data, info } = await fetchAllTasks()
				setTasks(data)
				setTabs(info)
				setError(null)
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

	async function refreshTasks(currentFilter) {
		try {
			const { data, info } = await fetchFilter(currentFilter);
			setTasks(data);
			setTabs(info);
			setError(null);
		} catch (error) {
			setError(error);
		}
	}


	return (
		<>
			<Header
				error={error}
				newTask={newTask}
				filter={filter}

				refreshTasks={refreshTasks}

				setError={setError}
				setTasks={setTasks}
				setNewTask={setNewTask}
			/>
			<Tabs
				filter={filter}
				tabs={tabs}
				tasks={tasks}

				setTasks={setTasks}
				setFilter={setFilter}
				setTabs={setTabs}
				setError={setError}
			/>
			<Tasks
				filter={filter}
				error={error}
				tasks={tasks}
				loading={loading}

				refreshTasks={refreshTasks}

				setError={setError}
				setTasks={setTasks}
			/>
		</>
	)

}

export default App
