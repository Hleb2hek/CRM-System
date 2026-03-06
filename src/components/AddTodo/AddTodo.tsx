import React, { useState } from 'react';
import { addUserTodo } from '../../api/todoApi';
import { Flex, Form, Input, Button, message } from 'antd';
import { AxiosError } from 'axios';
import { AddTodoProps } from '../../types/todo';

const ADD_TODO_TEXT = {
	EMPTY_FIELD: 'Поле пустое, введите значение',
	WHITESPACE: 'Уберите пробелы',
	TOO_LONG: 'Название слишком длинное. Допустимая максимальная длина 64 символа',
	TOO_SHORT: 'Название слишком короткое. Допустимая минимальная длина 2 символа',
	PLACEHOLDER: 'Введите название',
	ADD_BUTTON: 'Добавить',
	REQUEST_ERROR: 'Ошибка запроса',
	MIN_TITLE_LENGTH: 2,
	MAX_TITLE_LENGTH: 64,
};

const AddTodo: React.FC<AddTodoProps> = ({ refreshTasks }) => {
	const [, setErrorTasks] = useState<Error | null>(null);
	const [messageApi, contextHolder] = message.useMessage();

	const showError = (error: string) => {
		messageApi.open({
			type: 'error',
			content: error,
		});
	};

	const handleAddTodo = async (value: { task: string }): Promise<void> => {
		try {
			await addUserTodo(value.task?.trim());
			refreshTasks();
			setErrorTasks(null);
		} catch (error: unknown) {
			if (error instanceof AxiosError) {
				showError(error.response?.data?.message ?? error.message ?? ADD_TODO_TEXT.REQUEST_ERROR);
				return;
			}

			if (error instanceof Error) {
				showError(error.message);
			}
		}
	};

	return (
		<Flex justify="center" align="center" vertical style={{ marginTop: '4rem' }}>
			<Form onFinish={handleAddTodo}>
				<Flex gap="small" justify="center">
					<Form.Item
						name="task"
						validateTrigger="onSubmit"
						rules={[
							{ required: true, message: ADD_TODO_TEXT.EMPTY_FIELD },
							{ whitespace: true, message: ADD_TODO_TEXT.WHITESPACE },
							{
								max: ADD_TODO_TEXT.MAX_TITLE_LENGTH,
								message: ADD_TODO_TEXT.TOO_LONG,
							},
							{
								min: ADD_TODO_TEXT.MIN_TITLE_LENGTH,
								message: ADD_TODO_TEXT.TOO_SHORT,
							},
						]}>
						<Input placeholder={ADD_TODO_TEXT.PLACEHOLDER} />
					</Form.Item>
					<Form.Item>
						<Button htmlType="submit">{ADD_TODO_TEXT.ADD_BUTTON}</Button>
					</Form.Item>
				</Flex>
				{contextHolder}
			</Form>
		</Flex>
	);
};

export default AddTodo;
