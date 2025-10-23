import React, { useState } from 'react';

import { postUserTasks } from '../../api/http';

import { Flex, Form, Input, Button } from 'antd';

export const AddTasks: React.FC<{ refreshTasks: () => void }> = ({ refreshTasks }) => {
	const [errorTasks, setErrorTasks] = useState<Error | null>(null);

	async function createTasks(value: { task: string }) {
		try {
			await postUserTasks(value.task?.trim());
			refreshTasks();
			setErrorTasks(null);
		} catch (error: unknown) {
			if (error instanceof Error) setErrorTasks(error);
		}
	}

	return (
		<Flex justify="center" align="center" vertical style={{ marginTop: '4rem' }}>
			<Form onFinish={createTasks}>
				<Flex gap="small" justify="center">
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
					<Form.Item>
						<Button htmlType="submit">Добавить</Button>
					</Form.Item>
				</Flex>
				{errorTasks && <p>{errorTasks.message}</p>}
			</Form>
		</Flex>
	);
};
