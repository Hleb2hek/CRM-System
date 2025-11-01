import React from 'react';

import { TasksItem } from './TasksItem';
import { Filter, Todo } from '../../models/todo';

import { Flex, List } from 'antd';

interface Props {
	filter: Filter;
	tasks: Todo[];
	refreshTasks: () => void;
	setError: (arg: Error | null) => void;
}

const TodoList: React.FC<Props> = ({ tasks, refreshTasks, setError }) => {
	return (
		<Flex justify="center">
			<List
				dataSource={tasks}
				renderItem={({ id, title, isDone }) => (
					<List.Item>
						<TasksItem
							key={id}
							id={id}
							title={title}
							isDone={isDone}
							refreshTasks={refreshTasks}
							setError={setError}
						/>
					</List.Item>
				)}></List>
		</Flex>
	);
};
export default TodoList;
