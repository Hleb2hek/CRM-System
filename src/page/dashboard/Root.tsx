import { Outlet, useOutletContext } from 'react-router-dom';

import Navigation from '../../components/Navigation/Navigation';
import { Layout } from 'antd';
import { ContextType, Roles } from '../../types/admin';

const { Sider } = Layout;

const siderStyle: React.CSSProperties = {
	overflow: 'auto',
	height: '100vh',
	position: 'sticky',
	insetInlineStart: 0,
	top: 0,
	bottom: 0,
	scrollbarWidth: 'thin',
	scrollbarGutter: 'stable',
};
export default function Root() {
	return (
		<Layout style={{ minHeight: '100vh' }}>
			<Sider theme="light" style={siderStyle}>
				<Navigation />
			</Sider>

			<Layout>
				<Outlet />
			</Layout>
		</Layout>
	);
}
