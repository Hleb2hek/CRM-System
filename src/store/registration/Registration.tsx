import img from '../../../public/illustration.png';
import { Flex, Form, Input, Button, Typography, message } from 'antd';
import {
	LockOutlined,
	MailOutlined,
	UserOutlined,
	PhoneOutlined,
	LoginOutlined,
} from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { useAppDispatch } from '../store';
import { updateForm, registerUser } from './registrationSlice';
import { UserRegistration } from '../../models/authorizationType';
import { openModal } from '../modal/statusSlice';
import StatusModal from '../modal/Modal';

export default function Registration() {
	const [form] = Form.useForm();
	const dispatch = useAppDispatch();

	const onFinish = async (values: UserRegistration) => {
		try {
			if (!values.phoneNumber) {
				delete values.phoneNumber;
			}

			await dispatch(registerUser(values)).unwrap();
			form.resetFields();

			dispatch(openModal({ message: 'Вы успешно прошли регистрацию', type: 'success' }));
		} catch (err: any) {
			const message = values.login
				? `Ошибка регистрации: логин "${values.login}" уже существует`
				: values.email
				? `Ошибка регистрации: email "${values.email}" уже существует`
				: 'Ошибка регистрации';

			dispatch(openModal({ message, type: 'error' }));
		}
	};

	const handleChange =
		(field: keyof UserRegistration) => (e: React.ChangeEvent<HTMLInputElement>) => {
			const event = e.target.value;
			dispatch(updateForm({ field, value: event }));
		};

	return (
		<>
			<Flex>
				<img style={{ height: '100dvh' }} src={img} alt="Registration background" />

				<Flex style={{ width: '100%' }} justify="center" align="center">
					<Flex style={{ width: '420px' }} vertical gap={32}>
						<Flex vertical gap={8}>
							<Typography.Title level={2} style={{ margin: 0 }}>
								Create an Account
							</Typography.Title>
							<Typography.Text type="secondary">
								Join us and start managing your business
							</Typography.Text>
						</Flex>

						<Form form={form} layout="vertical" onFinish={onFinish}>
							<Form.Item
								label="Full Name"
								name="username"
								rules={[
									{ required: true, message: 'Please enter your full name!' },
									{ pattern: /^[a-zA-Zа-яА-Я\s]+$/, message: 'Only letters and spaces' },
									{ min: 1, max: 60 },
								]}>
								<Input
									prefix={<UserOutlined />}
									placeholder="John Doe"
									onChange={handleChange('username')}
								/>
							</Form.Item>

							<Form.Item
								label="Login"
								name="login"
								rules={[
									{ required: true, message: 'Please enter your login!' },
									{ min: 2, max: 60, message: '2–60 characters' },
									{ pattern: /^[a-zA-Z]+$/, message: 'Only letters and spaces' },
								]}>
								<Input
									prefix={<LoginOutlined />}
									placeholder="myLogin123"
									onChange={handleChange('login')}
								/>
							</Form.Item>

							<Form.Item
								label="Email"
								name="email"
								rules={[
									{ required: true, message: 'Please enter your email!' },
									{ type: 'email', message: 'Invalid email address!' },
								]}>
								<Input
									prefix={<MailOutlined />}
									placeholder="mail@abc.com"
									onChange={handleChange('email')}
								/>
							</Form.Item>

							<Form.Item label="Phone" name="phoneNumber">
								<Input
									prefix={<PhoneOutlined />}
									placeholder="+7 (999) 123-45-67"
									onChange={handleChange('phoneNumber')}
								/>
							</Form.Item>

							<Form.Item
								label="Password"
								name="password"
								rules={[
									{ required: true, message: 'Please enter your password!' },
									{ min: 6, max: 60, message: 'Password must be 6–60 characters' },
								]}>
								<Input.Password
									prefix={<LockOutlined />}
									placeholder="*********"
									onChange={handleChange('password')}
								/>
							</Form.Item>

							<Form.Item
								name="confirm"
								label="Confirm Password"
								dependencies={['password']}
								hasFeedback
								rules={[
									{ required: true, message: 'Please confirm your password!' },
									({ getFieldValue }) => ({
										validator(_, value) {
											if (!value || getFieldValue('password') === value) {
												return Promise.resolve();
											}
											return Promise.reject(new Error('Passwords do not match!'));
										},
									}),
								]}>
								<Input.Password prefix={<LockOutlined />} placeholder="*********" />
							</Form.Item>

							<Form.Item>
								<Button type="primary" htmlType="submit" block size="large">
									Create Account
								</Button>
							</Form.Item>
						</Form>

						<Flex justify="center">
							<Typography.Text type="secondary">
								Already have an account?
								<Link to="/" style={{ marginLeft: '10px' }}>
									Sign in
								</Link>
							</Typography.Text>
						</Flex>
					</Flex>
				</Flex>
			</Flex>
			<StatusModal />
		</>
	);
}
