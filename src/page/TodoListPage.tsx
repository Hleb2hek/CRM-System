import { useState, useEffect, useCallback, useMemo } from 'react';

import AddTodo from '../components/AddTasks/AddTodo';
import TabsList from '../components/TabsList/TabsList';
import TodoList from '../components/Tasks/TodoList';

import { fetchFilter } from '../api/http';
import { Filter, Todo, TodoInfo } from '../models/todo';

import { Flex } from 'antd';

export default function TodoListPage() {
	const [tasks, setTasks] = useState<Todo[]>([]);
	const [tabs, setTabs] = useState<TodoInfo>({
		all: 0,
		completed: 0,
		inWork: 0,
	});

	const [filter, setFilter] = useState<Filter>('all');
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [error, setError] = useState<Error | null>(null);

	const refreshTasks = async () => {
		setIsLoading(true);
		try {
			const { data, info } = await fetchFilter(filter);
			setTasks(data);
			if (info) {
				setTabs(info);
			}
			setError(null);
		} catch (error: unknown) {
			if (error instanceof Error) setError(error);
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		refreshTasks();
		const intervalId = setInterval(() => {
			refreshTasks();
		}, 5000);
		return () => clearInterval(intervalId);
	}, [filter]);

	return (
		<>
			<AddTodo refreshTasks={refreshTasks} />
			<TabsList setFilter={setFilter} tabs={tabs} filter={filter} />

			<Flex justify="center">
				{error && <p>{error.message}</p>}
				{isLoading && <p>Загрузка...</p>}
				{!isLoading && tasks.length === 0 && !error && <p>Задач пока нет</p>}
			</Flex>

			<TodoList filter={filter} tasks={tasks} refreshTasks={refreshTasks} setError={setError} />
		</>
	);
}
