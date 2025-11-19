// src/pages/Registration.tsx
import { useEffect } from 'react';
import { Flex, Form, Input, Button, Typography, message } from 'antd';
import {
	LockOutlined,
	MailOutlined,
	UserOutlined,
	PhoneOutlined,
	LoginOutlined,
} from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import img from '../../../public/illustration.png';
import { useAppDispatch, useAppSelector } from '../store';
import { clearAuthStatus, registerUser } from './registration.slice';

export default function Registration() {
	const [form] = Form.useForm();
	const dispatch = useAppDispatch();
	const navigate = useNavigate();
	const { loading, success, error } = useAppSelector((state) => state.auth);

	useEffect(() => {
		if (success) {
			message.success('Регистрация прошла успешно! Сейчас перенаправим...');
			const timer = setTimeout(() => {
				navigate('/todo');
			}, 2000);
			return () => clearTimeout(timer);
		}

		if (error) {
			message.error(typeof error === 'string' ? error : 'Ошибка регистрации');
			dispatch(clearAuthStatus());
		}
	}, [success, error, navigate, dispatch]);

	const onFinish = (values: any) => {
		const { confirm, ...data } = values;

		const payload = {
			login: data.login,
			username: data.username,
			password: data.password,
			email: data.email,
			phoneNumber: data.phoneNumber || '',
		};
		dispatch(registerUser(payload));
	};

	return (
		<Flex style={{ height: '100dvh' }}>
			<img
				src={img}
				alt="Registration background"
				style={{ objectFit: 'cover', width: '50%', height: '100%' }}
			/>

			<Flex style={{ width: '100%', overflowY: 'auto' }} justify="center" align="center">
				<Flex style={{ width: '420px' }} vertical gap={32}>
					<Flex vertical gap={8}>
						<Typography.Title level={2} style={{ margin: 0 }}>
							Создать аккаунт
						</Typography.Title>
						<Typography.Text type="secondary">
							Присоединяйтесь и начинайте управлять своим бизнесом
						</Typography.Text>
					</Flex>

					<Form
						form={form}
						layout="vertical"
						onFinish={onFinish}
						autoComplete="off"
						disabled={loading}>
						<Form.Item
							label="Имя пользователя"
							name="username"
							rules={[
								{ required: true, message: 'Введите имя пользователя!' },
								{
									min: 1,
									max: 60,
									pattern: /^[а-яА-ЯёЁa-zA-Z0-9\s]+$/,
									message: '1–60 символов, только буквы, цифры и пробелы',
								},
							]}>
							<Input prefix={<UserOutlined />} placeholder="Иван Иванов" />
						</Form.Item>
						<Form.Item
							label="Логин"
							name="login"
							rules={[
								{ required: true, message: 'Введите логин!' },
								{
									min: 2,
									max: 60,
									pattern: /^[a-zA-Z0-9]+$/,
									message: '2–60 символов, только латиница и цифры',
								},
							]}>
							<Input prefix={<LoginOutlined />} placeholder="myLogin123" />
						</Form.Item>
						<Form.Item
							label="Email"
							name="email"
							rules={[
								{ required: true, message: 'Введите email!' },
								{ type: 'email', message: 'Некорректный email!' },
							]}>
							<Input prefix={<MailOutlined />} placeholder="mail@abc.com" />
						</Form.Item>
						<Form.Item label="Телефон (необязательно)" name="phoneNumber">
							<Input prefix={<PhoneOutlined />} placeholder="+7 999 123 45 67" />
						</Form.Item>
						<Form.Item
							label="Пароль"
							name="password"
							rules={[
								{ required: true, message: 'Введите пароль!' },
								{ min: 6, message: 'Минимум 6 символов' },
							]}>
							<Input.Password prefix={<LockOutlined />} placeholder="*********" />
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
										return Promise.reject(new Error('Пароли не совпадают!'));
									},
								}),
							]}>
							<Input.Password prefix={<LockOutlined />} placeholder="*********" />
						</Form.Item>

						<Form.Item>
							<Button type="primary" htmlType="submit" block size="large" loading={loading}>
								Зарегистрироваться
							</Button>
						</Form.Item>
					</Form>

					<Flex justify="center">
						<Typography.Text type="secondary">
							Уже есть аккаунт? <Link to="/login">Войти</Link>
						</Typography.Text>
					</Flex>
				</Flex>
			</Flex>
		</Flex>
	);
}
