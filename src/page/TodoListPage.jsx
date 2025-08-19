import { useState, useEffect } from 'react';

import AddTasks from "../components/Header/AddTasks";
import Tabs from '../components/Tabs/Tabs';
import Tasks from "../components/Tasks/Tasks";

import { fetchFilter } from "../api/http";

function TodoListPage() {

	const [tasks, setTasks] = useState([]);
	const [tabs, setTabs] = useState({
		all: 0,
		completed: 0,
		inWork: 0
	})

	const [filter, setFilter] = useState("all")
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	async function refreshTasks() {
		setLoading(false)
		try {
			const { data, info } = await fetchFilter(filter);
			setTasks(data);
			setTabs(info);
			setError(null);
		} catch (error) {
			setError(error);
		}
	}

	useEffect(() => {
		refreshTasks()
	}, [filter]);

	return (
		<>
			<AddTasks
				error={error}
				filter={filter}

				refreshTasks={refreshTasks}

				setError={setError}
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

export default TodoListPage
