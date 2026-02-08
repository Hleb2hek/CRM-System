import { Navigate, Outlet } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/store';
import { Spin, Layout } from 'antd';
import { useEffect, useState } from 'react';
import authTokenStore from '../../utils/authTokenStore';
import { getProfileUser, refreshTokenSession } from '../../api/usersApi';
import { login, logout } from '../../store/authorization/authSlice';
import { AxiosError } from 'axios';
import { ContextType, Roles } from '../../types/admin';

const { Content } = Layout;

export const ProtectedRoute = () => {
	const [role, setRole] = useState<string[]>([]);
	const [loading, setLoading] = useState<boolean>(true);

	const dispatch = useAppDispatch();
	const { isAuthorization } = useAppSelector((s) => s.authorization);

	useEffect(() => {
		const checkAuth = async () => {
			const refreshToken = localStorage.getItem('refreshToken');
			const accessToken = authTokenStore.getAccessToken();

			if (refreshToken) {
				if (!accessToken) {
					try {
						const newTokens = await refreshTokenSession({ refreshToken });
						authTokenStore.setAccessToken(newTokens.accessToken);
						dispatch(login(newTokens.refreshToken));
					} catch (error) {
						if (error instanceof AxiosError) {
							if (error.response?.status === 401) {
								dispatch(logout());
							}
						}
					}
				} else {
					dispatch(login(refreshToken));
				}
			} else {
				dispatch(logout());
			}
			setLoading(false);
		};
		checkAuth();
	}, [dispatch]);

	useEffect(() => {
		const checkRole = async () => {
			try {
				const res = await getProfileUser();
				setRole(res.roles);
			} finally {
				setLoading(false);
			}
		};
		checkRole();
	}, []);

	const hasAccess = role.includes(Roles.ADMIN) || role.includes(Roles.MODERATOR);

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

	return <Outlet context={{ hasAccess } satisfies ContextType} />;
};
