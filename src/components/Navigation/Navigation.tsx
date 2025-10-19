import { ReactNode } from 'react';

import { useLocation, useNavigate } from 'react-router-dom';

import { Layout, Menu } from 'antd';
import { UnorderedListOutlined, UserOutlined } from '@ant-design/icons';

const { Sider } = Layout;

interface MenuItem {
	key: string;
	icon: ReactNode;
	label: string;
	path: string;
}

export default function Navigation() {
	const navigation = useNavigate();
	const locations = useLocation();

	const itemsArr: MenuItem[] = [
		{
			key: '1',
			icon: <UnorderedListOutlined />,
			label: 'Список задач',
			path: '/',
		},
		{
			key: '2',
			icon: <UserOutlined />,
			label: 'Профиль',
			path: '/profile',
		},
	];

	const defaultKey: string =
		itemsArr.find((item) => item.path === locations.pathname)?.key || '1';

	return (
		<Sider>
			<Menu
				mode="inline"
				theme="light"
				selectedKeys={[defaultKey]}
				style={{ height: '100%', borderRight: 0 }}
				onClick={({ key }) => {
					const path = itemsArr.find((arr) => arr.key === key)?.path;
					if (path) {
						return navigation(path);
					}
				}}
				items={itemsArr.map(({ key, icon, label }) => ({
					key,
					icon,
					label,
				}))}
			/>
		</Sider>
	);
}
