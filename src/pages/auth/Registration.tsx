import image from '../../assets/illustration.png';
import { Flex, Form, Input, Button, Typography, Alert, Space } from 'antd';
import {
	LockOutlined,
	MailOutlined,
	UserOutlined,
	PhoneOutlined,
	LoginOutlined,
} from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { UserRegistration } from '../../types/users';
import { registerUser } from '../../api/usersApi';
import { useState } from 'react';
import { AxiosError } from 'axios';

const REGISTRATION_TEXT = {
	TITLE: 'Создайте Аккаунт',
	SUBTITLE: 'Присоединяйтесь к нам',

	SUCCESS: 'Регистрация прошла успешно!',
	SUCCESS_DESC: 'Теперь вы можете войти в систему.',

	GO_TO_LOGIN: 'Перейти на страницу авторизации',

	USERNAME_LABEL: 'Имя пользователя',
	USERNAME_REQUIRED: 'Введите ваше имя!',
	USERNAME_PATTERN: 'Только буквы (русские или латинские) и пробелы',
	USERNAME_LENGTH: 'От 1 до 60 символов',

	LOGIN_LABEL: 'Логин',
	LOGIN_REQUIRED: 'Введите логин!',
	LOGIN_LENGTH: 'От 2 до 60 символов',
	LOGIN_PATTERN: 'Только латинские буквы и цифры',

	EMAIL_LABEL: 'Почта',
	EMAIL_REQUIRED: 'Введите email!',
	EMAIL_INVALID: 'Некорректный email!',

	PHONE_LABEL: 'Телефон (необязательно)',
	PHONE_INVALID: 'Некорректный формат телефона',

	PASSWORD_LABEL: 'Пароль',
	PASSWORD_REQUIRED: 'Введите пароль!',
	PASSWORD_LENGTH: 'Пароль от 6 до 60 символов',

	CONFIRM_LABEL: 'Повторите пароль',
	CONFIRM_REQUIRED: 'Подтвердите пароль!',
	CONFIRM_MATCH: 'Пароли не совпадают!',

	REGISTER_BUTTON: 'Зарегистрироваться',
	ALREADY_ACCOUNT: 'Уже есть аккаунт?',
	LOGIN_LINK: 'Войти',
};

export default function Registration() {
	const [form] = Form.useForm();
	const [isloading, setIsLoading] = useState<boolean>(false);

	const [alert, setAlert] = useState<{
		type: 'success' | 'error';
		message: string;
	} | null>(null);

	const showAlert = (type: 'success' | 'error', message: string) => {
		setAlert({ type, message });
	};

	const handleRegisterUser = async (values: UserRegistration) => {
		setIsLoading(true);
		setAlert(null);

		try {
			await registerUser(values);
			showAlert('success', REGISTRATION_TEXT.SUCCESS);
			form.resetFields();
		} catch (error: unknown) {
			if (error instanceof AxiosError) {
				showAlert('error', error.message);
			} else {
				showAlert('error', 'Произошла ошибка при регистрации');
			}
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Flex>
			<img style={{ height: '100dvh' }} src={image} alt="Registration background" />

			<Flex style={{ width: '100%' }} justify="center" align="center">
				<Flex style={{ width: '420px' }} vertical gap={32}>
					<Flex vertical gap={8}>
						<Typography.Title level={2} style={{ margin: 0 }}>
							{REGISTRATION_TEXT.TITLE}
						</Typography.Title>
						<Typography.Text type="secondary">{REGISTRATION_TEXT.SUBTITLE}</Typography.Text>
					</Flex>

					{alert?.type === 'success' ? (
						<Alert
							message={alert.message}
							type="success"
							description={
								<Space direction="vertical">
									<span>{REGISTRATION_TEXT.SUCCESS_DESC}</span>
									<Link to="/" style={{ fontWeight: 500 }}>
										{REGISTRATION_TEXT.GO_TO_LOGIN}
									</Link>
								</Space>
							}
							showIcon
							closable
							onClose={() => setAlert(null)}
						/>
					) : (
						<>
							{alert && (
								<Alert
									message={alert.message}
									type="error"
									showIcon
									closable
									onClose={() => setAlert(null)}
									style={{ marginBottom: 16 }}
								/>
							)}

							<Form form={form} layout="vertical" onFinish={handleRegisterUser}>
								<Form.Item
									label={REGISTRATION_TEXT.USERNAME_LABEL}
									name="username"
									rules={[
										{ required: true, message: REGISTRATION_TEXT.USERNAME_REQUIRED },
										{ pattern: /^[a-zA-Zа-яА-Я\s]+$/, message: REGISTRATION_TEXT.USERNAME_PATTERN },
										{ min: 1, max: 60, message: REGISTRATION_TEXT.USERNAME_LENGTH },
									]}>
									<Input prefix={<UserOutlined />} placeholder="Иван Иванов" />
								</Form.Item>

								<Form.Item
									label={REGISTRATION_TEXT.LOGIN_LABEL}
									name="login"
									rules={[
										{ required: true, message: REGISTRATION_TEXT.LOGIN_REQUIRED },
										{ min: 2, max: 60, message: REGISTRATION_TEXT.LOGIN_LENGTH },
										{ pattern: /^[a-zA-Z0-9]+$/, message: REGISTRATION_TEXT.LOGIN_PATTERN },
									]}>
									<Input prefix={<LoginOutlined />} placeholder="myLogin123" />
								</Form.Item>

								<Form.Item
									label={REGISTRATION_TEXT.EMAIL_LABEL}
									name="email"
									rules={[
										{ required: true, message: REGISTRATION_TEXT.EMAIL_REQUIRED },
										{ type: 'email', message: REGISTRATION_TEXT.EMAIL_INVALID },
									]}>
									<Input prefix={<MailOutlined />} placeholder="mail@abc.com" />
								</Form.Item>

								<Form.Item
									label={REGISTRATION_TEXT.PHONE_LABEL}
									name="phoneNumber"
									rules={[
										{
											pattern: /^\+?[0-9\s\-\(\)]+$/,
											message: REGISTRATION_TEXT.PHONE_INVALID,
										},
									]}>
									<Input prefix={<PhoneOutlined />} placeholder="+7 (999) 123-45-67" />
								</Form.Item>

								<Form.Item
									label={REGISTRATION_TEXT.PASSWORD_LABEL}
									name="password"
									rules={[
										{ required: true, message: REGISTRATION_TEXT.PASSWORD_REQUIRED },
										{ min: 6, max: 60, message: REGISTRATION_TEXT.PASSWORD_LENGTH },
									]}>
									<Input.Password prefix={<LockOutlined />} placeholder="*********" />
								</Form.Item>

								<Form.Item
									name="confirm"
									label={REGISTRATION_TEXT.CONFIRM_LABEL}
									dependencies={['password']}
									hasFeedback
									rules={[
										{ required: true, message: REGISTRATION_TEXT.CONFIRM_REQUIRED },
										({ getFieldValue }) => ({
											validator(_, value) {
												if (!value || getFieldValue('password') === value) {
													return Promise.resolve();
												}
												return Promise.reject(new Error(REGISTRATION_TEXT.CONFIRM_MATCH));
											},
										}),
									]}>
									<Input.Password prefix={<LockOutlined />} placeholder="*********" />
								</Form.Item>

								<Form.Item>
									<Button type="primary" htmlType="submit" block size="large" loading={isloading}>
										{REGISTRATION_TEXT.REGISTER_BUTTON}
									</Button>
								</Form.Item>
							</Form>

							<Flex justify="center">
								<Typography.Text type="secondary">
									{REGISTRATION_TEXT.ALREADY_ACCOUNT}
									<Link to="/" style={{ marginLeft: '10px' }}>
										{REGISTRATION_TEXT.LOGIN_LINK}
									</Link>
								</Typography.Text>
							</Flex>
						</>
					)}
				</Flex>
			</Flex>
		</Flex>
	);
}
