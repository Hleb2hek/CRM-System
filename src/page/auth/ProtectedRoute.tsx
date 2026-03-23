import { Navigate, Outlet } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/store';
import { Spin, Layout } from 'antd';
import { useEffect, useState } from 'react';
import tokenManager from '../../api/tokenManager';
import { refreshTokenSession } from '../../api/usersApi';
import { login, logout } from '../../store/authorization/authSlice';
import { AxiosError } from 'axios';

const { Content } = Layout;

export const ProtectedRoute = () => {
	const [isLoading, setIsLoading] = useState<boolean>(true);

	const dispatch = useAppDispatch();
	const { isAuthorization } = useAppSelector((select) => select.authorization);

	useEffect(() => {
		const checkAuth = async () => {
			const refreshToken = tokenManager.getRefreshToken();
			const accessToken = tokenManager.getAccessToken();

			if (refreshToken) {
				if (!accessToken) {
					try {
						const newTokens = await refreshTokenSession({ refreshToken });

						tokenManager.setAccessToken(newTokens.accessToken);
						tokenManager.setRefreshToken(newTokens.refreshToken);

						dispatch(login());
					} catch (error) {
						if (error instanceof AxiosError) {
							if (error.response?.status === 401) {
								dispatch(logout());
							}
						}
					}
				}
			} else {
				dispatch(logout());
			}
			setIsLoading(false);
		};
		checkAuth();
	}, [dispatch]);

	if (isLoading) {
		return (
			<Layout style={{ height: '100dvh' }}>
				<Content
					style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
					<Spin size="large" />
				</Content>
			</Layout>
		);
	}

	if (!isAuthorization) {
		return <Navigate to="/" replace />;
	}

	return <Outlet />;
};
