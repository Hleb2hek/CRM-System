import editSvg from '../../assets/edit.svg';
import trash from '../../assets/trash.svg';

import React, { useState } from 'react';

import { editTaskFetch, deleteTaskFetch } from '../../api/http';

import { Card, Checkbox, Button, Flex, Form, Input } from 'antd';

export const TasksItem: React.FC<{
	id: number;
	title: string;
	isDone: boolean;
	setError: (arg: Error | null) => void;
	refreshTasks: () => void;
}> = ({ id, title, isDone, refreshTasks, setError }) => {
	const [isEdit, setIsEdit] = useState<boolean>(false);

	const [inputTitle, setInputTitle] = useState<string>(title);

	function openEditMode() {
		setIsEdit(true);
		setInputTitle(title);
	}

	function closeEditMode() {
		setIsEdit(false);
		setInputTitle(title);
	}

	async function checkboxTasks() {
		try {
			await editTaskFetch(id, { isDone: !isDone });
			refreshTasks();
			setError(null);
		} catch (error) {
			if (error instanceof Error) setError(error);
		}
	}

	async function deleteTask() {
		try {
			await deleteTaskFetch(id);
			refreshTasks();
			setError(null);
		} catch (error) {
			if (error instanceof Error) setError(error);
		}
	}

	async function editTasks(value: { task: string }) {
		try {
			await editTaskFetch(id, { title: value.task?.trim() });
			refreshTasks();
			closeEditMode();
			setError(null);
		} catch (error) {
			if (error instanceof Error) setError(error);
		}
	}

	return (
		<Flex justify="center" align="center" style={{ width: '30rem' }}>
			<Card style={{ width: '100%' }}>
				{!isEdit ? (
					<Flex gap="1.25rem" align="center" justify="space-between">
						<Checkbox onChange={checkboxTasks} checked={isDone} type="checkbox" />
						<p style={{ margin: 0, overflowWrap: 'anywhere' }}>{title}</p>
						<Flex gap="0.625rem">
							<Button onClick={openEditMode}>
								<img src={editSvg} width={16} height={16} />
							</Button>
							<Button onClick={deleteTask}>
								<img src={trash} width={16} height={16} />
							</Button>
						</Flex>
					</Flex>
				) : (
					<Form onFinish={editTasks}>
						<Form.Item
							name="task"
							validateTrigger={['onChange', 'onSubmit']}
							rules={[
								{ required: true, message: 'Поле пустое, введите значение' },
								{ whitespace: true, message: 'Уберите пробелы' },
								{
									max: 64,
									message:
										'Название слишком динное. Допустимая максимальная длина 64 символа',
								},
								{
									min: 2,
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
