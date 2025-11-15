import { useLocation, useNavigate } from 'react-router-dom';

import { Layout, Menu } from 'antd';
import { UnorderedListOutlined, UserOutlined } from '@ant-design/icons';
import { MenuItem } from '../../models/todo';
const { Sider } = Layout;

export default function Navigation() {
	const navigation = useNavigate();

	const locations = useLocation();

	const itemsArr: MenuItem[] = [
		{
			key: '1',
			icon: <UnorderedListOutlined />,
			label: 'Список задач',
			path: '/todo',
		},
		{
			key: '2',
			icon: <UserOutlined />,
			label: 'Профиль',
			path: '/todo/profile',
		},
	];

	const defaultKey = itemsArr.find((item) => item.path === locations.pathname)?.key || '1';

	const handleClick = (key: string) => {
		const path = itemsArr.find((arr) => arr.key === key)?.path;
		if (path) {
			return navigation(path);
		}
	};

	return (
		<Sider theme="light">
			<Menu
				mode="inline"
				theme="light"
				selectedKeys={[defaultKey]}
				style={{ height: '100%', borderRight: 0, position: 'relative' }}
				onClick={(e) => handleClick(e.key)}
				items={itemsArr.map(({ key, icon, label }) => ({
					key,
					icon,
					label,
				}))}
			/>
		</Sider>
	);
}
