import React, { useState } from 'react';
import { editUserTodo, deleteUserTodo } from '../../api/todoApi';
import { Card, Checkbox, Button, Flex, Form, Input } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { TaskItemProps } from '../../types/todo';

const TASKS_ITEM_TEXT = {
	MAX_LENGTH_ERROR: 'Название слишком длинное. Допустимая максимальная длина 64 символа',
	MIN_LENGTH_ERROR: 'Название слишком короткое. Допустимая минимальная длина 2 символа',
	PLACEHOLDER: 'Введите название',
	SAVE: 'Сохранить',
	CANCEL: 'Отменить',
	MIN_TITLE_LENGTH: 2,
	MAX_TITLE_LENGTH: 64,
};

export const TasksItem: React.FC<TaskItemProps> = ({
	id,
	title,
	isDone,
	refreshTasks,
	setError,
}) => {
	const [isEdit, setIsEdit] = useState<boolean>(false);
	const [form] = Form.useForm();

	const openEditMode = () => setIsEdit(true);
	const closeEditMode = () => setIsEdit(false);

	const handleChangeTodoStatus = async () => {
		try {
			await editUserTodo(id, { isDone: !isDone });
			refreshTasks();
			setError(null);
		} catch (error) {
			if (error instanceof Error) setError(error);
		}
	};

	const handleDeleteTask = async () => {
		try {
			await deleteUserTodo(id);
			refreshTasks();
			setError(null);
		} catch (error) {
			if (error instanceof Error) setError(error);
		}
	};

	const handleEditTask = async (value: { task: string }) => {
		try {
			await editUserTodo(id, { title: value.task?.trim() });
			refreshTasks();
			closeEditMode();
			setError(null);
		} catch (error) {
			if (error instanceof Error) setError(error);
		}
	};

	return (
		<Flex justify="center" align="center" style={{ width: '30rem' }}>
			<Card style={{ width: '100%' }}>
				{!isEdit ? (
					<Flex gap="1.25rem" align="center" justify="space-between">
						<Checkbox onChange={handleChangeTodoStatus} checked={isDone} type="checkbox" />
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
					<Form form={form} initialValues={{ task: title }} onFinish={handleEditTask}>
						<Form.Item
							name="task"
							validateTrigger="onSubmit"
							rules={[
								{
									max: TASKS_ITEM_TEXT.MAX_TITLE_LENGTH,
									message: TASKS_ITEM_TEXT.MAX_LENGTH_ERROR,
								},
								{
									min: TASKS_ITEM_TEXT.MIN_TITLE_LENGTH,
									message: TASKS_ITEM_TEXT.MIN_LENGTH_ERROR,
								},
							]}>
							<Input placeholder={TASKS_ITEM_TEXT.PLACEHOLDER} />
						</Form.Item>
						<Flex gap="0.625rem" justify="center">
							<Button type="primary" htmlType="submit">
								{TASKS_ITEM_TEXT.SAVE}
							</Button>
							<Button type="primary" htmlType="button" onClick={closeEditMode}>
								{TASKS_ITEM_TEXT.CANCEL}
							</Button>
						</Flex>
					</Form>
				)}
			</Card>
		</Flex>
	);
};
