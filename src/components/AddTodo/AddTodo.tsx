import React, { useState } from 'react';

import { addUserTodo } from '../../api/todoApi';

import { Flex, Form, Input, Button, message } from 'antd';
import { AxiosError } from 'axios';

interface Props {
	refreshTasks: () => void;
}

const AddTodo: React.FC<Props> = ({ refreshTasks }) => {
	const [errorTasks, setErrorTasks] = useState<Error | null>(null);
	const [messageApi, contextHolder] = message.useMessage();

	const errorAntd = (error: string) => {
		messageApi.open({
			type: 'error',
			content: error,
		});
	};
	const MAX_TITLE_LENGTH = 64;
	const MIN_TITLE_LENGTH = 2;

	const createTasks = async (value: { task: string }) => {
		try {
			await addUserTodo(value.task?.trim());
			refreshTasks();
			setErrorTasks(null);
		} catch (error: unknown) {
			if (error instanceof AxiosError) {
				errorAntd(error.response?.data?.message ?? error.message ?? 'Ошибка запроса');
				return;
			}

			if (error instanceof Error) {
				errorAntd(error.message);
			}
		}
	};

	return (
		<Flex justify="center" align="center" vertical style={{ marginTop: '4rem' }}>
			<Form onFinish={createTasks}>
				<Flex gap="small" justify="center">
					<Form.Item
						name="task"
						validateTrigger="onSubmit"
						rules={[
							{ required: true, message: 'Поле пустое, введите значение' },
							{ whitespace: true, message: 'Уберите пробелы' },
							{
								max: MAX_TITLE_LENGTH,
								message: 'Название слишком длинное. Допустимая максимальная длина 64 символа',
							},
							{
								min: MIN_TITLE_LENGTH,
								message: 'Название слишком короткое. Допустимая минимальная длина 2 символа',
							},
						]}>
						<Input placeholder="Введите название" />
					</Form.Item>
					<Form.Item>
						<Button htmlType="submit">Добавить</Button>
					</Form.Item>
				</Flex>
				{contextHolder}
			</Form>
		</Flex>
	);
};

export default AddTodo;
