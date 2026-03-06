import React from 'react';

import { TasksItem } from './TasksItem';
import { TodoListProps } from '../../types/todo';

import { Flex, List } from 'antd';

const TodoList: React.FC<TodoListProps> = ({ tasks, refreshTasks, setError }) => {
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
