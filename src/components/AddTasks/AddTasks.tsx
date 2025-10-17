import React, { useState } from 'react';

import { postUserTasks } from '../../api/http';

import { Flex, Form, Input, Button } from 'antd';

export const AddTasks: React.FC<{ refreshTasks: () => void }> = ({ refreshTasks }) => {
	const [newTask, setNewTask] = useState<string>('');
	const [errorValidation, setErrorValidation] = useState<string | null>(null);
	const [errorTasks, setErrorTasks] = useState<Error | null>(null);

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
		setNewTask(value);

		const errorMessage = getValidError(value);
		setErrorValidation(errorMessage);
	}

	async function createTasks(e: React.FormEvent) {
		const validationError = getValidError(newTask);
		if (validationError) {
			setErrorValidation(validationError);
			return;
		}

		try {
			await postUserTasks(newTask.trim());
			refreshTasks();

			setNewTask('');
			setErrorValidation(null);
			setErrorTasks(null);
		} catch (error: unknown) {
			if (error instanceof Error) setErrorTasks(error);
		}
	}

	const isFormValid = !errorValidation && newTask.trim().length > 0;

	return (
		<Flex justify="center" align="center" vertical style={{ marginTop: '4rem' }}>
			<Form onFinish={createTasks}>
				<Flex gap="small" justify="center">
					<Form.Item validateStatus={errorValidation ? 'error' : ''} help={errorValidation}>
						<Input
							value={newTask}
							onChange={getNewTask}
							type="text"
							placeholder="Введите название"
						/>
					</Form.Item>
					<Form.Item>
						<Button htmlType="submit" disabled={!isFormValid}>
							Добавить
						</Button>
					</Form.Item>
				</Flex>
				{errorTasks && <p>{errorTasks.message}</p>}
			</Form>
		</Flex>
	);
};
