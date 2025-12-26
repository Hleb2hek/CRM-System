import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/store';
import { getProfile } from '../store/profile/profileSlice';
import { logout } from '../store/authorization/authSlice';
import { Card, Typography, Button, Spin, Space, Row, Col } from 'antd';

const { Title, Text } = Typography;

export default function Profile() {
	const dispatch = useAppDispatch();
	const { data, loading, error } = useAppSelector((state) => state.profile);

	useEffect(() => {
		dispatch(getProfile());
	}, [dispatch]);

	if (loading) {
		return (
			<Row justify="center" align="middle" style={{ height: '100vh' }}>
				<Spin size="large" tip="Загрузка..." />
			</Row>
		);
	}

	if (error) {
		return (
			<Row justify="center" align="middle" style={{ height: '100vh' }}>
				<Text type="danger">{error}</Text>
			</Row>
		);
	}

	if (!data) return null;

	return (
		<Row justify="center" align="middle" style={{ height: '100vh' }}>
			<Col>
				<Card
					title={<Title level={3}>Профиль пользователя</Title>}
					style={{ width: 350, textAlign: 'center' }}
					actions={[
						<Button type="primary" danger onClick={() => dispatch(logout())}>
							Logout
						</Button>,
					]}>
					<Space direction="vertical" size="middle" style={{ width: '100%' }}>
						<div>
							<Text strong>Username: </Text>
							<Text>{data.username}</Text>
						</div>
						<div>
							<Text strong>Email: </Text>
							<Text>{data.email}</Text>
						</div>
						<div>
							<Text strong>Phone: </Text>
							<Text>{data.phoneNumber || '-'}</Text>
						</div>
					</Space>
				</Card>
			</Col>
		</Row>
	);
}
