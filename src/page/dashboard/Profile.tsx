import { useEffect, useState } from 'react';
import { useAppDispatch } from '../../store/store';
import { logout } from '../../store/authorization/authSlice';
import { Card, Typography, Button, Spin, Space, Row, Col, Alert, Skeleton } from 'antd';
import { getProfileUser } from '../../api/usersApi';
import { AxiosError } from 'axios';
import tokenManager from '../../utils/tokenManager';
import { useNavigate } from 'react-router-dom';
import type { Profile } from '../../types/users';

const { Title, Text } = Typography;

const objectString = {
	profile: 'Профиль пользователя',
	login: 'Логин: ',
	email: 'Email: ',
	phone: 'Телефон: ',
	phoneNumberAvailability: 'Отсутствует',
};

export default function Profile() {
	const dispatch = useAppDispatch();
	const navigate = useNavigate();

	const [profile, setProfile] = useState<Profile | null>(null);
	const [isloading, setIsLoading] = useState<boolean>(false);
	const [isLoggout, setIsLoggout] = useState<boolean>(false);

	const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

	const showAlert = (type: 'success' | 'error', message: string) => {
		setAlert({ type, message });
		setTimeout(() => setAlert(null), 10000);
	};

	useEffect(() => {
		setIsLoading(true);
		(async () => {
			try {
				const profile = await getProfileUser();
				setProfile(profile);
				showAlert('success', 'Профиль пользователя загружен');
			} catch (error) {
				if (error instanceof AxiosError) {
					showAlert('error', error.message);
				}
			} finally {
				setIsLoading(false);
			}
		})();
	}, []);

	const handleLogout = () => {
		try {
			setIsLoggout(true);

			tokenManager.clearAccessToken();
			dispatch(logout());

			navigate('/auth');
		} finally {
			setIsLoggout(false);
		}
	};

	if (isloading) {
		return (
			<Row justify="center" align="middle" style={{ height: '100vh' }}>
				<Spin size="large" tip="Загрузка..." />
			</Row>
		);
	}

	if (!profile) return null;

	return (
		<Row justify="center" align="middle" style={{ height: '100vh' }}>
			<Col>
				{alert && (
					<Alert
						message={alert.message}
						type={alert.type}
						showIcon
						closable
						onClose={() => setAlert(null)}
						style={{ marginBottom: 16 }}
					/>
				)}
				<Card
					title={<Title level={3}>{objectString.profile}</Title>}
					style={{ width: 350, textAlign: 'center' }}
					actions={[
						<Button type="primary" danger onClick={handleLogout} loading={isLoggout}>
							Logout
						</Button>,
					]}>
					{profile ? (
						<Space direction="vertical" size="middle" style={{ width: '100%' }}>
							<div>
								<Text strong>{objectString.login}</Text>
								<Text>{profile.username}</Text>
							</div>
							<div>
								<Text strong>{objectString.email}</Text>
								<Text>{profile.email}</Text>
							</div>
							<div>
								<Text strong>{objectString.phone}</Text>
								<Text>
									{profile.phoneNumber || objectString.phoneNumberAvailability}
								</Text>
							</div>
						</Space>
					) : (
						<Skeleton />
					)}
				</Card>
			</Col>
		</Row>
	);
}
