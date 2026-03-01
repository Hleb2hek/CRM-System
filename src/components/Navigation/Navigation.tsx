import { useLocation, useNavigate, useOutletContext } from 'react-router-dom';

import { Layout, Menu } from 'antd';
import {
	UnorderedListOutlined,
	UserOutlined,
	BarsOutlined,
	UserSwitchOutlined,
	UsergroupAddOutlined,
} from '@ant-design/icons';
import { MenuItem } from '../../types/todo';
import { ContextType } from '../../types/admin';
const { Sider } = Layout;

export default function Navigation() {
	const { hasAccess } = useOutletContext<ContextType>();

	const navigate = useNavigate();
	const location = useLocation();

	let itemsArray: MenuItem[] = [
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
		{
			key: '3',
			icon: <UsergroupAddOutlined />,
			label: 'Пользователи',
			path: '/todo/users',
		},
	];

	if (!hasAccess) {
		const adminMenuStartIndex = 2;
		itemsArray.splice(adminMenuStartIndex);
	}

	const defaultKey = itemsArray.find((item) => item.path === location.pathname)?.key ?? '';

	const handleClick = (key: string) => {
		const path = itemsArray.find((arr) => arr.key === key)?.path;
		if (path) {
			return navigate(path);
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
				items={itemsArray.map(({ key, icon, label }) => ({
					key,
					icon,
					label,
				}))}
			/>
		</Sider>
	);
}
