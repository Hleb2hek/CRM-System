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

const AUTHORIZATION_TEXT = {
	IMAGE_ALT: 'Фон для авторизации',

	TITLE: 'Зайдите в свой аккаунт',
	SUBTITLE: 'Посмотрите, что происходит с вашим бизнесом',

	LOGIN_LABEL: 'Логин',
	LOGIN_PLACEHOLDER: 'Логин',
	LOGIN_REQUIRED: 'Пожалуйста, введите свой логин',

	PASSWORD_LABEL: 'Пароль',
	PASSWORD_PLACEHOLDER: '*********',
	PASSWORD_REQUIRED: 'Пожалуйста, введите свой пароль',

	LOGIN_BUTTON: 'Login',

	NOT_REGISTERED: 'Еще не зарегистрировались?',
	CREATE_ACCOUNT: 'Создать учетную запись',
};

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
			<img style={{ height: '100dvh' }} src={image} alt={AUTHORIZATION_TEXT.IMAGE_ALT} />

			<Flex style={{ width: '100%' }} justify="center" align="center">
				<Flex style={{ width: '420px' }} vertical gap={32}>
					<Flex vertical gap={8}>
						<Typography.Title level={2} style={{ margin: 0 }}>
							{AUTHORIZATION_TEXT.TITLE}
						</Typography.Title>
						<Typography.Text type="secondary">{AUTHORIZATION_TEXT.SUBTITLE}</Typography.Text>
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
							label={AUTHORIZATION_TEXT.LOGIN_LABEL}
							name="login"
							rules={[{ required: true, message: AUTHORIZATION_TEXT.LOGIN_REQUIRED }]}>
							<Input prefix={<MailOutlined />} placeholder={AUTHORIZATION_TEXT.LOGIN_PLACEHOLDER} />
						</Form.Item>

						<Form.Item
							label={AUTHORIZATION_TEXT.PASSWORD_LABEL}
							name="password"
							rules={[{ required: true, message: AUTHORIZATION_TEXT.PASSWORD_REQUIRED }]}>
							<Input.Password
								prefix={<LockOutlined />}
								placeholder={AUTHORIZATION_TEXT.PASSWORD_PLACEHOLDER}
							/>
						</Form.Item>

						<Form.Item>
							<Button type="primary" htmlType="submit" block size="large" loading={isLoading}>
								{AUTHORIZATION_TEXT.LOGIN_BUTTON}
							</Button>
						</Form.Item>
					</Form>

					<Flex justify="center">
						<Typography.Text type="secondary">
							{AUTHORIZATION_TEXT.NOT_REGISTERED}
							<Link to="/registration" style={{ marginLeft: '10px' }}>
								{AUTHORIZATION_TEXT.CREATE_ACCOUNT}
							</Link>
						</Typography.Text>
					</Flex>
				</Flex>
			</Flex>
		</Flex>
	);
}
