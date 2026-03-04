import image from '../../assets/illustration.png';
import { Flex, Form, Input, Button, Typography, Alert } from 'antd';
import { LockOutlined, MailOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router';
import { useAppDispatch } from '../../store/store';
import { AuthData } from '../../types/users';
import tokenManager from '../../utils/tokenManager';
import { loginUser } from '../../api/usersApi';
import { login } from '../../store/authorization/authSlice';
import { useState } from 'react';
import { AxiosError } from 'axios';

export default function Authorization() {
	const [form] = Form.useForm();
	const [isLoading, setIsLoading] = useState(false);
	const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

	const navigate = useNavigate();
	const dispatch = useAppDispatch();

	const showAlert = (type: 'success' | 'error', message: string) => {
		setAlert({ type, message });
		setTimeout(() => setAlert(null), 4500);
	};

	const onFinish = async (values: AuthData) => {
		setIsLoading(true);
		try {
			const { accessToken, refreshToken } = await loginUser(values);

			tokenManager.setAccessToken(accessToken);
			tokenManager.setRefreshToken(refreshToken);
			dispatch(login());

			form.resetFields();
			navigate('/todo');
		} catch (error: unknown) {
			if (error instanceof AxiosError) {
				showAlert('error', error.message);
			}
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Flex>
			<img style={{ height: '100dvh' }} src={image} alt="Фон для авторизации" />

			<Flex style={{ width: '100%' }} justify="center" align="center">
				<Flex style={{ width: '420px' }} vertical gap={32}>
					<Flex vertical gap={8}>
						<Typography.Title level={2} style={{ margin: 0 }}>
							Зайдите в свой аккаунт
						</Typography.Title>
						<Typography.Text type="secondary">
							Посмотрите, что происходит с вашим бизнесом
						</Typography.Text>
					</Flex>

					{alert && (
						<Alert
							message={alert.message}
							type={alert.type}
							showIcon
							style={{ borderRadius: 8 }}
							closable
							onClose={() => setAlert(null)}
						/>
					)}

					<Form form={form} layout="vertical" onFinish={onFinish}>
						<Form.Item
							label="Логин"
							name="login"
							rules={[{ required: true, message: 'Пожалуйста, введите свой логин' }]}>
							<Input prefix={<MailOutlined />} placeholder="Логин" />
						</Form.Item>

						<Form.Item
							label="Пароль"
							name="password"
							rules={[
								{ required: true, message: 'Пожалуйста, введите свой пароль!' },
							]}>
							<Input.Password prefix={<LockOutlined />} placeholder="*********" />
						</Form.Item>

						<Form.Item>
							<Button
								type="primary"
								htmlType="submit"
								block
								size="large"
								loading={isLoading}>
								Login
							</Button>
						</Form.Item>
					</Form>

					<Flex justify="center">
						<Typography.Text type="secondary">
							Еще не зарегистрировались?
							<Link to="/registration" style={{ marginLeft: '10px' }}>
								Создать учетную запись
							</Link>
						</Typography.Text>
					</Flex>
				</Flex>
			</Flex>
		</Flex>
	);
}
