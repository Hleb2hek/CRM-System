import img from '../../assets/illustration.png';
import { Flex, Form, Input, Button, Typography, Checkbox, message, Alert } from 'antd';
import { LockOutlined, MailOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router';
import { useAppDispatch, useAppSelector } from '../store';
import { AuthData } from '../../models/authorizationType';
import { authUser } from './authSlice';

export default function Authorization() {
	const navigate = useNavigate();
	const [form] = Form.useForm();
	const dispatch = useAppDispatch();
	const { error: serverError, loading } = useAppSelector((state) => state.authorization);

	const onFinish = async (values: AuthData) => {
		try {
			await dispatch(authUser(values)).unwrap();
			form.resetFields();
			navigate('/todo');
		} catch {}
	};

	return (
		<Flex>
			<img style={{ height: '100dvh' }} src={img} alt="Фон для авторизации" />

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

					{serverError && (
						<Alert
							message={serverError}
							type="error"
							showIcon
							style={{ borderRadius: 8 }}
							closable
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
							rules={[{ required: true, message: 'Пожалуйста, введите свой пароль!' }]}>
							<Input.Password prefix={<LockOutlined />} placeholder="*********" />
						</Form.Item>

						<Form.Item>
							<Button type="primary" htmlType="submit" block size="large" loading={loading}>
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
