import img from '../../../public/illustration.png';
import { Flex, Form, Input, Button, Typography, Checkbox } from 'antd';
import { LockOutlined, MailOutlined } from '@ant-design/icons';
import { Link } from 'react-router';

export default function Authorization() {
	return (
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

					<Form layout="vertical">
						<Form.Item
							label="Email"
							name="email"
							rules={[
								{ required: true, message: 'Please input your email!' },
								{ type: 'email', message: 'The input is not valid E-mail!' },
							]}>
							<Input prefix={<MailOutlined />} placeholder="mail@abc.com" />
						</Form.Item>

						<Form.Item
							label="Password"
							name="password"
							rules={[{ required: true, message: 'Please input your password!' }]}>
							<Input.Password prefix={<LockOutlined />} placeholder="*********" />
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
						<Form.Item>
							<Link to="todo">Login</Link>
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
	);
}
