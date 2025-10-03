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
	const [validationError, setValidationError] = useState<string | null>(null);

	function openEditMode() {
		setIsEdit(true);
		setInputTitle(title);
		setValidationError(null);
	}

	function closeEditMode() {
		setIsEdit(false);
		setInputTitle(title);
		setValidationError(null);
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

	function getValidError(tasks: string): string | null {
		const value = tasks.trim();
		const valueLength = value.length;

		if (valueLength === 0) {
			return 'Название пустое, введите название';
		}
		if (valueLength < 2) {
			return `Название слишком короткое. Добавьте ${2 - valueLength} символ(ов)`;
		}
		if (valueLength > 64) {
			return `Название слишком длинное. Удалите ${valueLength - 64} символ(ов)`;
		}

		return null;
	}

	function getNewTask(event: React.ChangeEvent<HTMLInputElement>) {
		const value = event.target.value;
		setInputTitle(value);

		const errorMessage = getValidError(value);
		setValidationError(errorMessage);
	}

	async function editTasks() {
		const validationError = getValidError(inputTitle);
		if (validationError) {
			setValidationError(validationError);
			return;
		}

		try {
			await editTaskFetch(id, { title: inputTitle });
			refreshTasks();
			closeEditMode();
			setError(null);
		} catch (error) {
			if (error instanceof Error) setError(error);
		}
	}

	const isFormValid = !validationError && inputTitle.trim().length > 0;

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
							validateStatus={validationError ? 'error' : ''}
							help={validationError}>
							<Input
								value={inputTitle}
								onChange={getNewTask}
								placeholder="Введите название"
							/>
						</Form.Item>
						<Flex gap="0.625rem" justify="center">
							<Button type="primary" htmlType="submit" disabled={!isFormValid}>
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
