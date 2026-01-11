import { useEffect, useState } from 'react';
import { useAppDispatch } from '../store/store';
import { logout } from '../store/authorization/authSlice';
import { Card, Typography, Button, Spin, Space, Row, Col } from 'antd';
import { getProfileUser } from '../services/usersApi';
import { AxiosError } from 'axios';
import authTokenStore from '../utils/authTokenStore';
import { useNavigate } from 'react-router-dom';
import type { Profile } from '../types/users';

const { Title, Text } = Typography;

export default function Profile() {
	const dispatch = useAppDispatch();
	const navigate = useNavigate();

	const [data, setData] = useState<Profile | null>(null);
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);
	const [loggout, setLoggout] = useState<boolean>(false);

	useEffect(() => {
		setLoading(true);
		(async () => {
			try {
				const profile = await getProfileUser();
				setData(profile);
			} catch (error) {
				if (error instanceof AxiosError) {
					setError(error.message);
				} else {
					setError('Ошибка загрузки профиля');
				}
			} finally {
				setLoading(false);
			}
		})();
	}, []);

	const handleLogout = async () => {
		try {
			setLoggout(true);

			authTokenStore.clearAccessToken();
			localStorage.removeItem('refreshToken');
			dispatch(logout());

			navigate('/auth');
		} finally {
			setLoggout(false);
		}
	};

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
						<Button type="primary" danger onClick={handleLogout} loading={loggout}>
							Logout
						</Button>,
					]}>
					<Space direction="vertical" size="middle" style={{ width: '100%' }}>
						<div>
							<Text strong>Логин: </Text>
							<Text>{data.username}</Text>
						</div>
						<div>
							<Text strong>Email: </Text>
							<Text>{data.email}</Text>
						</div>
						<div>
							<Text strong>Телефон: </Text>
							<Text>{data.phoneNumber || 'Отсутствует'}</Text>
						</div>
					</Space>
				</Card>
			</Col>
		</Row>
	);
}
