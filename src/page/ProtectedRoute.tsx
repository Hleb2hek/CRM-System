import { Navigate, Outlet } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/store';
import { Spin, Layout } from 'antd';
import { useEffect, useState } from 'react';
import authClass from '../utils/AuthClass';
import { refreshTokenSession } from '../services/usersApi';
import { login, logout } from '../store/authorization/authSlice';
import { AxiosError } from 'axios';

const { Content } = Layout;

export default function ProtectedRoute() {
	const dispatch = useAppDispatch();
	const [loading, setLoading] = useState<boolean>(true);
	const { isAuthorization } = useAppSelector((s) => s.authorization);

	useEffect(() => {
		const checkAuth = async () => {
			const refreshToken = localStorage.getItem('refreshToken');
			const accessToken = authClass.getAccessToken();

			if (!refreshToken) {
				dispatch(logout());
				setLoading(false);
				return;
			}

			try {
				if (!accessToken) {
					const newTokens = await refreshTokenSession({ refreshToken });
					authClass.setAccessToken(newTokens.accessToken);
					dispatch(login(newTokens.refreshToken));
				} else {
					dispatch(login(refreshToken));
				}
			} catch (error) {
				if (error instanceof AxiosError) {
					dispatch(logout());
				}
			}
		};

		checkAuth();
	}, [dispatch]);

	if (loading) {
		return (
			<Layout style={{ height: '100dvh' }}>
				<Content style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
					<Spin size="large" tip="Loading..." />
				</Content>
			</Layout>
		);
	}

	if (!isAuthorization) {
		return <Navigate to="/" replace />;
	}

	return <Outlet />;
}
