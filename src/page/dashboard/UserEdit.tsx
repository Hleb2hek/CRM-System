import { useCallback, useEffect, useState } from 'react';
import { AxiosError } from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Button, Form, Input, Spin, Typography, Space, Alert } from 'antd';

import { User, UserRequest } from '../../types/admin';
import { getUserById, updateUser } from '../../api/adminApi';

const { Title, Text } = Typography;

const USER_EDIT_TEXT = {
	NO_CHANGES_TO_SAVE: 'Нет изменений для сохранения',
	DATA_HAS_BEEN_UPDATED: 'Данные успешно обновлены',

	USER_WAS_NOT_FOUND: 'Пользователь не найден',
	USER_PROFILE: 'Профиль пользователя',
	USER_NAME: 'Имя пользователя',

	ENTER_USER_NAME: 'Введите имя пользователя',
	ENTER_EMAIL: 'Введите email',

	INCORRECT_EMAIL_ADDRESS: 'Некорректный email',

	GO_BACK_TO_LIST: 'Вернуться к списку',

	PHONE: 'Телефон',
	PHONE_EMPTY: '—',

	SAVE: 'Сохранить',
	CANCEL: 'Отмена',
	EMAIL: 'Email',
	EDIT: 'Редактировать',
};

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

	const handleSave = async (values: UserRequest) => {
		if (!user) return;

		setIsSaving(true);

		try {
			const changedFields: Partial<UserRequest> = {};

			if (values.username !== user.username) {
				changedFields.username = values.username;
			}

			if (values.email !== user.email) {
				changedFields.email = values.email;
			}

			if (values.phoneNumber !== user.phoneNumber) {
				changedFields.phoneNumber = values.phoneNumber || undefined;
			}

			if (!Object.keys(changedFields).length) {
				showAlert('success', USER_EDIT_TEXT.NO_CHANGES_TO_SAVE);
				setIsEditing(false);
				return;
			}

			await updateUser(userId, changedFields);

			setUser((prevUser) => (prevUser ? { ...prevUser, ...changedFields } : null));
			setIsEditing(false);

			showAlert('success', USER_EDIT_TEXT.DATA_HAS_BEEN_UPDATED);
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
		return (
			<div style={{ textAlign: 'center', marginTop: 40 }}>{USER_EDIT_TEXT.USER_WAS_NOT_FOUND}</div>
		);
	}

	return (
		<div style={{ maxWidth: 600, margin: '32px auto', padding: '0 16px' }}>
			<Title level={3}>{USER_EDIT_TEXT.USER_PROFILE}</Title>

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
					<Form form={form} layout="vertical" onFinish={handleSave}>
						<Form.Item
							name="username"
							label={USER_EDIT_TEXT.USER_NAME}
							rules={[{ required: true, message: USER_EDIT_TEXT.ENTER_USER_NAME }]}>
							<Input />
						</Form.Item>

						<Form.Item
							name="email"
							label={USER_EDIT_TEXT.EMAIL}
							rules={[
								{ required: true, message: USER_EDIT_TEXT.ENTER_EMAIL },
								{ type: 'email', message: USER_EDIT_TEXT.INCORRECT_EMAIL_ADDRESS },
							]}>
							<Input />
						</Form.Item>

						<Form.Item name="phoneNumber" label={USER_EDIT_TEXT.PHONE}>
							<Input />
						</Form.Item>

						<Space>
							<Button type="primary" htmlType="submit" loading={isSaving} disabled={isSaving}>
								{USER_EDIT_TEXT.SAVE}
							</Button>
							<Button onClick={handleCancel} disabled={isSaving}>
								{USER_EDIT_TEXT.CANCEL}
							</Button>
						</Space>
					</Form>
				) : (
					<Space direction="vertical" size="middle" style={{ width: '100%' }}>
						<div>
							<Text type="secondary">{USER_EDIT_TEXT.USER_NAME}</Text>
							<div>{user.username}</div>
						</div>

						<div>
							<Text type="secondary">{USER_EDIT_TEXT.EMAIL}</Text>
							<div>{user.email}</div>
						</div>

						<div>
							<Text type="secondary">{USER_EDIT_TEXT.PHONE}</Text>
							<div>{user.phoneNumber || USER_EDIT_TEXT.PHONE_EMPTY}</div>
						</div>

						<Space>
							<Button type="primary" onClick={() => setIsEditing(true)}>
								{USER_EDIT_TEXT.EDIT}
							</Button>

							<Button onClick={() => navigate('/todo/users')}>
								{USER_EDIT_TEXT.GO_BACK_TO_LIST}
							</Button>
						</Space>
					</Space>
				)}
			</Card>
		</div>
	);
};
