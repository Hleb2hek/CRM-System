import img from '../../../public/illustration.png';
import { Flex, Form, Input, Button, Typography, Checkbox } from 'antd';
import { LockOutlined, MailOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router';
import { useAppDispatch } from '../store';
import { AuthData, ErrorStatus } from '../../models/authorizationType';
import { authForm, authUser } from './authSlice';
import { openModal } from '../modal/statusSlice';
import StatusModal from '../modal/Modal';

export default function Authorization() {
	const navigate = useNavigate();
	const [form] = Form.useForm();
	const dispatch = useAppDispatch();

	const onFinish = async (values: AuthData) => {
		try {
			await dispatch(authUser(values)).unwrap();
			form.resetFields();
			navigate('/todo');
		} catch (error: unknown) {
			function isError(error: any): error is ErrorStatus {
				return error;
			}
			if (isError(error)) {
				const err: ErrorStatus = error;
				if (err.status === 404) {
					dispatch(
						openModal({
							message: err.message,
							type: 'error',
						}),
					);
				} else if (err.status === 401 || err.status === 403) {
					dispatch(
						openModal({
							message: err.message,
							type: 'error',
						}),
					);
				}
			}
		}
	};

	const handleChange = (field: keyof AuthData) => (e: React.ChangeEvent<HTMLInputElement>) => {
		const event = e.target.value;
		dispatch(authForm({ field, value: event }));
	};
	return (
		<>
			<Flex>
				<img style={{ height: '100dvh' }} src={img} alt="Фон для авторизации" />

				<Flex style={{ width: '100%' }} justify="center" align="center">
					<Flex style={{ width: '420px' }} vertical gap={32}>
						<Flex vertical gap={8}>
							<Typography.Title level={2} style={{ margin: 0 }}>
								Login to your Account
							</Typography.Title>
							<Typography.Text type="secondary">
								See what is going on with your business
							</Typography.Text>
						</Flex>

						<Form form={form} layout="vertical" onFinish={onFinish}>
							<Form.Item
								label="Login"
								name="login"
								rules={[{ required: true, message: 'Please input your login' }]}>
								<Input
									prefix={<MailOutlined />}
									placeholder="mail@abc.com"
									onChange={handleChange('login')}
								/>
							</Form.Item>

							<Form.Item
								label="Password"
								name="password"
								rules={[{ required: true, message: 'Please input your password!' }]}>
								<Input.Password
									prefix={<LockOutlined />}
									placeholder="*********"
									onChange={handleChange('password')}
								/>
							</Form.Item>

							<Form.Item>
								<Flex justify="space-between" align="center">
									<Checkbox>Remember Me</Checkbox>
									<Typography.Link href="#" style={{ fontSize: 14 }}>
										Forgot Password?
									</Typography.Link>
								</Flex>
							</Form.Item>

							<Form.Item>
								<Button type="primary" htmlType="submit" block size="large">
									Login
								</Button>
							</Form.Item>
						</Form>

						<Flex justify="center">
							<Typography.Text type="secondary">
								Not Registered Yet?
								<Link to="/registration" style={{ marginLeft: '10px' }}>
									Create an account
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
