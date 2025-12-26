import { Navigate, Outlet } from 'react-router-dom';
import { useAppSelector } from '../store/store';
import { Spin, Layout } from 'antd';

const { Content } = Layout;

export default function ProtectedRoute() {
	const { loading, userAuth } = useAppSelector((s) => s.authorization);

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
