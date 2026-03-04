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

			showAlert('success', 'Регистрация прошла успешно!');
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
							Создайте Аккаунт
						</Typography.Title>
						<Typography.Text type="secondary">Присоединяйтесь к нам</Typography.Text>
					</Flex>

					{alert?.type === 'success' ? (
						<Alert
							message={alert.message}
							type="success"
							description={
								<Space direction="vertical">
									<span>Теперь вы можете войти в систему.</span>
									<Link to="/" style={{ fontWeight: 500 }}>
										Перейти на страницу авторизации
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
									label="Имя пользователя"
									name="username"
									rules={[
										{ required: true, message: 'Введите ваше имя!' },
										{
											pattern: /^[a-zA-Zа-яА-Я\s]+$/,
											message:
												'Только буквы (русские или латинские) и пробелы',
										},
										{ min: 1, max: 60, message: 'От 1 до 60 символов' },
									]}>
									<Input prefix={<UserOutlined />} placeholder="Иван Иванов" />
								</Form.Item>

								<Form.Item
									label="Логин"
									name="login"
									rules={[
										{ required: true, message: 'Введите логин!' },
										{ min: 2, max: 60, message: 'От 2 до 60 символов' },
										{
											pattern: /^[a-zA-Z0-9]+$/,
											message: 'Только латинские буквы и цифры',
										},
									]}>
									<Input prefix={<LoginOutlined />} placeholder="myLogin123" />
								</Form.Item>

								<Form.Item
									label="Почта"
									name="email"
									rules={[
										{ required: true, message: 'Введите email!' },
										{ type: 'email', message: 'Некорректный email!' },
									]}>
									<Input prefix={<MailOutlined />} placeholder="mail@abc.com" />
								</Form.Item>

								<Form.Item
									label="Телефон (необязательно)"
									name="phoneNumber"
									rules={[
										{
											pattern: /^\+?[0-9\s\-\(\)]+$/,
											message: 'Некорректный формат телефона',
										},
									]}>
									<Input
										prefix={<PhoneOutlined />}
										placeholder="+7 (999) 123-45-67"
									/>
								</Form.Item>

								<Form.Item
									label="Пароль"
									name="password"
									rules={[
										{ required: true, message: 'Введите пароль!' },
										{ min: 6, max: 60, message: 'Пароль от 6 до 60 символов' },
									]}>
									<Input.Password
										prefix={<LockOutlined />}
										placeholder="*********"
									/>
								</Form.Item>

								<Form.Item
									name="confirm"
									label="Повторите пароль"
									dependencies={['password']}
									hasFeedback
									rules={[
										{ required: true, message: 'Подтвердите пароль!' },
										({ getFieldValue }) => ({
											validator(_, value) {
												if (!value || getFieldValue('password') === value) {
													return Promise.resolve();
												}
												return Promise.reject(
													new Error('Пароли не совпадают!'),
												);
											},
										}),
									]}>
									<Input.Password
										prefix={<LockOutlined />}
										placeholder="*********"
									/>
								</Form.Item>

								<Form.Item>
									<Button
										type="primary"
										htmlType="submit"
										block
										size="large"
										loading={isloading}>
										Зарегистрироваться
									</Button>
								</Form.Item>
							</Form>

							<Flex justify="center">
								<Typography.Text type="secondary">
									Уже есть аккаунт?
									<Link to="/" style={{ marginLeft: '10px' }}>
										Войти
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
