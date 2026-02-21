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
	const [saving, setSaving] = useState(false);
	const [isEditing, setIsEditing] = useState(false);

	const [error, setError] = useState<string>('');
	const [success, setSuccess] = useState<string>('');

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
				setError(error.message);
			}
		} finally {
			setLoading(false);
		}
	};

	const handleSave = async () => {
		setError('');
		setSuccess('');
		setSaving(true);

		try {
			const changedFields: Partial<UserRequest> = {};
			const current = form.getFieldsValue();

			if (current.username !== user?.username) changedFields.username = current.username;
			if (current.email !== user?.email) changedFields.email = current.email;
			if (current.phoneNumber !== user?.phoneNumber) {
				changedFields.phoneNumber = current.phoneNumber || undefined;
			}

			if (Object.keys(changedFields).length === 0) {
				setSuccess('Нет изменений для сохранения');
				setIsEditing(false);
				setSaving(false);
				return;
			}

			await updateUser(userId, changedFields);

			setUser((prev) => (prev ? { ...prev, ...changedFields } : null));

			setSuccess('Данные успешно обновлены');
			setIsEditing(false);
		} catch (error: unknown) {
			if (error instanceof AxiosError) {
				setError(error.message);
			}
		} finally {
			setSaving(false);
		}
	};

	const handleEdit = () => {
		setError('');
		setSuccess('');
		setIsEditing(true);
	};

	const handleCancel = () => {
		if (user) {
			form.setFieldsValue({
				username: user.username,
				email: user.email,
				phoneNumber: user.phoneNumber,
			});
		}
		setError('');
		setSuccess('');
		setIsEditing(false);
	};

	useEffect(() => {
		loadUser();
	}, [userId, form]);

	if (loading) return <Spin size="large" style={{ display: 'block', margin: '100px auto' }} />;

	if (!user) return <div>Пользователь не найден</div>;

	return (
		<div style={{ maxWidth: 600, margin: '32px auto', padding: '0 16px' }}>
			<Title level={3}>Профиль пользователя</Title>

			{success && (
				<Alert message={success} type="success" showIcon style={{ marginBottom: 16 }} />
			)}

			{error && <Alert message={error} type="error" showIcon style={{ marginBottom: 16 }} />}

			<Card>
				{isEditing ? (
					<Form form={form} layout="vertical">
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
							<Button
								type="primary"
								onClick={handleSave}
								loading={saving}
								disabled={saving}>
								Сохранить
							</Button>
							<Button onClick={handleCancel} disabled={saving}>
								Отмена
							</Button>
						</Space>
					</Form>
				) : (
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
							<Button type="primary" onClick={handleEdit}>
								Редактировать
							</Button>
							<Button onClick={() => navigate('/todo/users')}>
								Вернуться к списку
							</Button>
						</Space>
					</Space>
				)}
			</Card>
		</div>
	);
};
