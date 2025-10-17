import { Outlet } from 'react-router-dom';

import Navigation from '../components/Navigation/Navigation';
import { Layout } from 'antd';

export default function Root() {
	return (
		<Layout style={{ minHeight: '100vh' }}>
			<Navigation />
			<Layout>
				<Outlet />
			</Layout>
		</Layout>
	);
}
