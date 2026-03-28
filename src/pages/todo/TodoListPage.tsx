import { useState, useEffect } from 'react';

import AddTodo from '../../components/AddTodo/AddTodo';
import TabsList from '../../components/TabsList/TabsList';
import TodoList from '../../components/Tasks/TodoList';

import { getTodosByFilter } from '../../api/todoApi';
import { Filter, Todo, TodoInfo } from '../../types/todo';

import { Flex } from 'antd';

const TODO_LIST_PAGE_TEXT = {
	LOADING: 'Загрузка...',
	NO_TASKS: 'Задач пока нет',
};

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
			const { data, info } = await getTodosByFilter(filter);
			setTasks(data);
			if (info) {
				setTabs(info);
			}
			setError(null);
		} catch (error: unknown) {
			if (error instanceof Error) {
				setError(error);
			}
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
				{isLoading && <p>{TODO_LIST_PAGE_TEXT.LOADING}</p>}
				{!isLoading && tasks.length === 0 && !error && <p>{TODO_LIST_PAGE_TEXT.NO_TASKS}</p>}
			</Flex>

			<TodoList filter={filter} tasks={tasks} refreshTasks={refreshTasks} setError={setError} />
		</>
	);
}
