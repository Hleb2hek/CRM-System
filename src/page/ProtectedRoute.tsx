import { Navigate, Outlet } from 'react-router-dom';
import { useAppSelector } from '../store/store';
import { Spin, Layout } from 'antd';
import { useEffect } from 'react';
import { useAppDispatch } from '../store/store';
import { refreshToken } from '../store/authorization/authSlice';

const { Content } = Layout;

export default function ProtectedRoute() {
	const { loading, userAuth } = useAppSelector((s) => s.authorization);
	const dispatch = useAppDispatch();

	useEffect(() => {
		const intervalId = setInterval(() => {
			dispatch(refreshToken());
		}, 5 * 60 * 1000);
		return () => clearInterval(intervalId);
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

	if (!userAuth) {
		return <Navigate to="/" replace />;
	}

	return <Outlet />;
}
