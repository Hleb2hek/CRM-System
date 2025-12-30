import React, { useState } from 'react';

import { editUserTodo, deleteUserTodo } from '../../services/todoApi';

import { Card, Checkbox, Button, Flex, Form, Input } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';

interface Props {
	id: number;
	title: string;
	isDone: boolean;
	setError: (arg: Error | null) => void;
	refreshTasks: () => void;
}

export const TasksItem: React.FC<Props> = ({ id, title, isDone, refreshTasks, setError }) => {
	const [isEdit, setIsEdit] = useState<boolean>(false);

	const MAX_TITLE_LENGTH = 64;
	const MIN_TITLE_LENGTH = 2;

	const openEditMode = () => {
		setIsEdit(true);
	};

	const closeEditMode = () => {
		setIsEdit(false);
	};

	const handleChangeTodoStatus = async () => {
		try {
			await editUserTodo(id, { isDone: !isDone });
			refreshTasks();
			setError(null);
		} catch (error) {
			if (error instanceof Error) {
				setError(error);
			}
		}
	};

	const handleDeleteTask = async () => {
		try {
			await deleteUserTodo(id);
			refreshTasks();
			setError(null);
		} catch (error) {
			if (error instanceof Error) {
				setError(error);
			}
		}
	};

	const handleEditTask = async (value: { task: string }) => {
		try {
			await editUserTodo(id, { title: value.task?.trim() });
			refreshTasks();
			closeEditMode();
			setError(null);
		} catch (error) {
			if (error instanceof Error) {
				setError(error);
			}
		}
	};

	return (
		<Flex justify="center" align="center" style={{ width: '30rem' }}>
			<Card style={{ width: '100%' }}>
				{!isEdit ? (
					<Flex gap="1.25rem" align="center" justify="space-between">
						<Checkbox
							onChange={handleChangeTodoStatus}
							checked={isDone}
							type="checkbox"
						/>
						<p style={{ margin: 0, overflowWrap: 'anywhere' }}>{title}</p>
						<Flex gap="0.625rem">
							<Button onClick={openEditMode}>
								<EditOutlined />
							</Button>
							<Button onClick={handleDeleteTask}>
								<DeleteOutlined />
							</Button>
						</Flex>
					</Flex>
				) : (
					<Form onFinish={handleEditTask}>
						<Form.Item
							name="task"
							validateTrigger="onSubmit"
							rules={[
								{
									max: MAX_TITLE_LENGTH,
									message:
										'Название слишком динное. Допустимая максимальная длина 64 символа',
								},
								{
									min: MIN_TITLE_LENGTH,
									message:
										'Название слишком короткое. Допустимая минимальная длина 2 символа',
								},
							]}>
							<Input placeholder="Введите название" />
						</Form.Item>
						<Flex gap="0.625rem" justify="center">
							<Button type="primary" htmlType="submit">
								Сохранить
							</Button>
							<Button type="primary" htmlType="button" onClick={closeEditMode}>
								Отменить
							</Button>
						</Flex>
					</Form>
				)}
			</Card>
		</Flex>
	);
};
