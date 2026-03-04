import { useCallback, useEffect, useState } from 'react';
import { AxiosError } from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Button, Form, Input, Spin, Typography, Space, Alert } from 'antd';

import { User, UserRequest } from '../../types/admin';
import { getUserById, updateUser } from '../../api/adminApi';

const { Title, Text } = Typography;

export const UserEdit = () => {
	const { id } = useParams<{ id: string }>();
	const navigate = useNavigate();
	const userId = Number(id);

	const [form] = Form.useForm<UserRequest>();

	const [user, setUser] = useState<User | null>(null);
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [isSaving, setIsSaving] = useState<boolean>(false);
	const [isEditing, setIsEditing] = useState<boolean>(false);

	const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

	const showAlert = (type: 'success' | 'error', message: string) => {
		setAlert({ type, message });
		setTimeout(() => setAlert(null), 4500);
	};

	const loadUser = useCallback(async () => {
		setIsLoading(true);
		try {
			const data = await getUserById(userId);

			setUser(data);

			form.setFieldsValue({
				username: data.username,
				email: data.email,
				phoneNumber: data.phoneNumber,
			});
		} catch (error) {
			if (error instanceof AxiosError) {
				showAlert('error', error.message);
			}
		} finally {
			setIsLoading(false);
		}
	}, [userId, form]);

	const handleSave = async () => {
		if (!user) return;

		setIsSaving(true);

		try {
			const current = form.getFieldsValue();
			const changedFields: Partial<UserRequest> = {};

			if (current.username !== user.username) {
				changedFields.username = current.username;
			}

			if (current.email !== user.email) {
				changedFields.email = current.email;
			}

			if (current.phoneNumber !== user.phoneNumber) {
				changedFields.phoneNumber = current.phoneNumber || undefined;
			}

			if (!Object.keys(changedFields).length) {
				showAlert('success', 'Нет изменений для сохранения');
				setIsEditing(false);
				return;
			}

			await updateUser(userId, changedFields);

			setUser((prev) => (prev ? { ...prev, ...changedFields } : null));
			setIsEditing(false);

			showAlert('success', 'Данные успешно обновлены');
		} catch (error) {
			if (error instanceof AxiosError) {
				showAlert('error', error.message);
			}
		} finally {
			setIsSaving(false);
		}
	};

	const handleCancel = () => {
		if (!user) return;

		form.setFieldsValue({
			username: user.username,
			email: user.email,
			phoneNumber: user.phoneNumber,
		});

		setIsEditing(false);
	};

	useEffect(() => {
		loadUser();
	}, [loadUser]);

	if (isLoading) {
		return <Spin size="large" style={{ display: 'block', margin: '100px auto' }} />;
	}

	if (!user) {
		return <div style={{ textAlign: 'center', marginTop: 40 }}>Пользователь не найден</div>;
	}

	return (
		<div style={{ maxWidth: 600, margin: '32px auto', padding: '0 16px' }}>
			<Title level={3}>Профиль пользователя</Title>

			{alert && (
				<Alert
					message={alert.message}
					type={alert.type}
					showIcon
					closable
					onClose={() => setAlert(null)}
					style={{ marginBottom: 16 }}
				/>
			)}

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
								loading={isSaving}
								disabled={isSaving}>
								Сохранить
							</Button>

							<Button onClick={handleCancel} disabled={isSaving}>
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
							<Button type="primary" onClick={() => setIsEditing(true)}>
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
