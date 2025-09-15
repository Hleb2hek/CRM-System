import { useState, useEffect } from 'react';

import styles from './error.module.css'

import { AddTasks } from "../components/AddTasks/AddTasks";
import { Tabs } from '../components/Tabs/Tabs';
import { Tasks } from "../components/Tasks/Tasks";

import { fetchFilter } from "../api/http";
import { Filter, Todo, TodoInfo } from '../models/todo';

export default function TodoListPage() {

	const [tasks, setTasks] = useState<Todo[]>([]);
	const [tabs, setTabs] = useState<TodoInfo>({
		all: 0,
		completed: 0,
		inWork: 0
	})

	const [filter, setFilter] = useState<Filter>("all");
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<Error | null>(null);

	async function refreshTasks() {
		setLoading(true)
		try {
			const { data, info } = await fetchFilter(filter);
			setTasks(data);
			if (info) setTabs(info);
			setError(null);
		} catch (error: unknown) {
			if (error instanceof Error) setError(error);
		} finally {
			setLoading(false);
		}
	}

	useEffect(() => {
		refreshTasks();
	}, [filter]);

	return (
		<>
			<AddTasks
				refreshTasks={refreshTasks}
			/>
			<Tabs
				setFilter={setFilter}

				tabs={tabs}
				filter={filter}
			/>

			<section className={`${styles.error} ${styles.container}`}>
				{error && <p>{error.message}</p>}
				{loading && <p>Загрузка...</p>}
				{!loading && tasks.length === 0 && !error && <p>Задач пока нет</p>}
			</section>

			<Tasks
				filter={filter}
				tasks={tasks}

				refreshTasks={refreshTasks}
				setError={setError}
			/>
		</>
	)

}
