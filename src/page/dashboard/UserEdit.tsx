import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Button, Form, Input, message, Spin, Typography, Divider, Space, Flex } from 'antd';
import { MailOutlined, PhoneOutlined, UserSwitchOutlined } from '@ant-design/icons';

import { User, UserRequest } from '../../types/admin';
import { getUserById, updateUser } from '../../api/adminApi';

const { Title, Text } = Typography;

export const UserEdit = () => {
	const { id } = useParams<{ id: string }>();
	const navigate = useNavigate();

	const userId = Number(id);
	const isValidId = Number.isInteger(userId) && userId > 0;

	const [form] = Form.useForm<UserRequest>();
	const [user, setUser] = useState<User | null>(null);
	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);
	const [editing, setEditing] = useState(false);

	useEffect(() => {
		if (!isValidId) {
			message.error('Некорректный ID пользователя');
			navigate('/todo/users');
			return;
		}

		const loadUser = async () => {
			try {
				setLoading(true);
				const fetchedUser = await getUserById(userId);
				setUser(fetchedUser);

				// Устанавливаем начальные значения формы
				form.setFieldsValue({
					username: fetchedUser.username,
					email: fetchedUser.email,
					phoneNumber: fetchedUser.phoneNumber || '',
				});
			} catch (err) {
				console.error('Ошибка загрузки пользователя:', err);
				message.error('Не удалось загрузить профиль пользователя');
				navigate('/todo/users');
			} finally {
				setLoading(false);
			}
		};

		loadUser();
	}, [userId, navigate, form]);

	const handleSave = async (values: UserRequest) => {
		console.log('[SAVE] Данные из формы:', values); // ← 1

		setSaving(true);
		try {
			console.log('[SAVE] Отправляем на сервер userId:', userId); // ← 2

			const response = await updateUser(userId, values);
			console.log('[SAVE] Ответ от сервера после PUT:', response); // ← 3

			message.success('Сохранено (по крайней мере сервер сказал ок)');

			console.log('[SAVE] Запрашиваем свежие данные...');
			const freshUser = await getUserById(userId);
			console.log('[SAVE] Свежий пользователь с сервера:', freshUser); // ← 4

			setUser(freshUser);
			form.setFieldsValue({
				username: freshUser.username,
				email: freshUser.email,
				phoneNumber: freshUser.phoneNumber || '',
			});

			setEditing(false);
		} catch (err: any) {
			console.error('[SAVE] ОШИБКА при сохранении:');
			console.error('→', err);
			console.error('→ response?', err.response);
			console.error('→ данные ошибки?', err.response?.data);

			const msg =
				err.response?.data?.message || err.message || 'Неизвестная ошибка при сохранении';
			message.error(msg);
		} finally {
			setSaving(false);
		}
	};

	if (loading) {
		return (
			<div
				style={{
					minHeight: '60vh',
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
				}}>
				<Spin size="large" />
			</div>
		);
	}

	if (!user) {
		return (
			<div style={{ textAlign: 'center', padding: 80 }}>
				<Title level={3}>Пользователь не найден</Title>
				<Button type="primary" onClick={() => navigate('/todo/users')}>
					Вернуться к списку
				</Button>
			</div>
		);
	}

	return (
		<div style={{ maxWidth: 720, margin: '0 auto', padding: '32px 16px' }}>
			<Title level={3} style={{ textAlign: 'center', marginBottom: 32 }}>
				Профиль пользователя
			</Title>

			<Card>
				{!editing ? (
					<>
						<Space direction="vertical" size="middle" style={{ width: '100%' }}>
							<div>
								<Text type="secondary">Имя пользователя</Text>
								<div style={{ fontSize: 16, marginTop: 4 }}>
									<UserSwitchOutlined style={{ marginRight: 8 }} />
									{user.username}
								</div>
							</div>

							<div>
								<Text type="secondary">Email</Text>
								<div style={{ fontSize: 16, marginTop: 4 }}>
									<MailOutlined style={{ marginRight: 8 }} />
									{user.email}
								</div>
							</div>

							<div>
								<Text type="secondary">Телефон</Text>
								<div style={{ fontSize: 16, marginTop: 4 }}>
									<PhoneOutlined style={{ marginRight: 8 }} />
									{user.phoneNumber || 'Не указан'}
								</div>
							</div>
						</Space>

						<Divider />

						<Flex gap={12} justify="space-between" wrap="wrap">
							<Button
								type="primary"
								onClick={() => setEditing(true)}
								style={{ minWidth: 140 }}>
								Редактировать
							</Button>

							<Button
								onClick={() => navigate('/todo/users')}
								style={{ minWidth: 140 }}>
								← Назад к списку
							</Button>
						</Flex>
					</>
				) : (
					<Form form={form} layout="vertical" onFinish={handleSave}>
						<Form.Item
							name="username"
							label="Имя пользователя"
							rules={[
								{ required: true, message: 'Обязательно' },
								{
									pattern: /^[a-zA-Z0-9_-]+$/,
									message: 'Только латинские буквы, цифры, _ и - разрешены',
								},
								{ max: 50, message: 'Максимум 50 символов' },
							]}>
							<Input placeholder="латинские буквы и цифры" />
						</Form.Item>

						<Form.Item
							name="email"
							label="Email"
							rules={[
								{ required: true, message: 'Пожалуйста, введите email' },
								{ type: 'email', message: 'Введите корректный email' },
							]}>
							<Input placeholder="example@domain.com" />
						</Form.Item>

						<Form.Item name="phoneNumber" label="Номер телефона">
							<Input placeholder="+7 (XXX) XXX-XX-XX" />
						</Form.Item>

						<Space size="middle" style={{ marginTop: 16 }}>
							<Button type="primary" htmlType="submit" loading={saving}>
								Сохранить изменения
							</Button>

							<Button
								onClick={() => {
									setEditing(false);
									form.resetFields(); // возвращаем форму в исходное состояние
								}}
								disabled={saving}>
								Отмена
							</Button>
						</Space>
					</Form>
				)}
			</Card>
		</div>
	);
};
