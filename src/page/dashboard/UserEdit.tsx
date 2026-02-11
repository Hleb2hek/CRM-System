import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Button, Form, Input, Spin, Typography, Space, Alert } from 'antd';
import { User, UserRequest } from '../../types/admin';
import { getUserById, updateUser } from '../../api/adminApi';
import { AxiosError } from 'axios';

const { Title, Text } = Typography;

export const UserEdit = () => {
	const { id } = useParams<{ id: string }>();
	const navigate = useNavigate();
	const userId = Number(id);

	const [form] = Form.useForm<UserRequest>();

	const [user, setUser] = useState<User | null>(null);
	const [loading, setLoading] = useState(true);
	const [editing, setEditing] = useState(false);

	const [error, setError] = useState<string>('');
	const [success, setSuccess] = useState<string>('');

	useEffect(() => {
		const loadUser = async () => {
			try {
				const data = await getUserById(userId);
				setUser(data);
				form.setFieldsValue({
					username: data.username,
					email: data.email,
					phoneNumber: data.phoneNumber,
				});
			} catch (error: unknown) {
				if (error instanceof AxiosError) {
					setError(error.message || 'Не удалось загрузить пользователя');
				}
			} finally {
				setLoading(false);
			}
		};

		loadUser();
	}, [userId]);

	const handleSave = async (values: UserRequest) => {
		setError('');
		setSuccess('');

		try {
			await updateUser(userId, values);

			setUser({
				...user!,
				...values,
			});

			setEditing(false);
			setSuccess('Данные успешно обновлены');
		} catch (error: unknown) {
			if (error instanceof AxiosError) {
				setError(error.message || 'Не удалось загрузить список пользователей');
			}
		}
	};

	if (loading) return <Spin size="large" style={{ display: 'block', margin: '100px auto' }} />;

	if (!user) return <div>Пользователь не найден</div>;

	return (
		<div style={{ maxWidth: 600, margin: '32px auto', padding: '0 16px' }}>
			<Title level={3}>Профиль пользователя</Title>

			{success && <Alert message={success} type="success" showIcon style={{ marginBottom: 16 }} />}

			{error && <Alert message={error} type="error" showIcon style={{ marginBottom: 16 }} />}

			<Card>
				{!editing ? (
					<Space direction="vertical" size="middle" style={{ width: '100%' }}>
						<div>
							<Text type="secondary">Имя пользователя</Text>
							<div>{user.username}</div>
						</div>

						<div>
							<Text type="secondary">Email</Text>
							<div>{user.email}</div>
						</div>

						<div>
							<Text type="secondary">Телефон</Text>
							<div>{user.phoneNumber || '—'}</div>
						</div>

						<Space>
							<Button
								type="primary"
								onClick={() => {
									setError('');
									setSuccess('');
									setEditing(true);
								}}>
								Редактировать
							</Button>

							<Button onClick={() => navigate('/todo/users')}>Вернуться</Button>
						</Space>
					</Space>
				) : (
					<Form form={form} layout="vertical" onFinish={handleSave}>
						<Form.Item
							name="username"
							label="Имя пользователя"
							rules={[{ required: true, message: 'Введите имя пользователя' }]}>
							<Input />
						</Form.Item>

						<Form.Item
							name="email"
							label="Email"
							rules={[
								{ required: true, message: 'Введите email' },
								{ type: 'email', message: 'Некорректный email' },
							]}>
							<Input />
						</Form.Item>

						<Form.Item name="phoneNumber" label="Телефон">
							<Input />
						</Form.Item>

						<Space>
							<Button type="primary" htmlType="submit">
								Сохранить
							</Button>
							<Button onClick={() => setEditing(false)}>Отмена</Button>
						</Space>
					</Form>
				)}
			</Card>
		</div>
	);
};
