import { useLocation, useNavigate } from 'react-router-dom';

import { Layout, Menu } from 'antd';
import { UnorderedListOutlined, UserOutlined, BarsOutlined } from '@ant-design/icons';
import { MenuItem } from '../../types/todo';
import { useEffect, useState } from 'react';
import { getProfileUser } from '../../api/usersApi';
import { Roles } from '../../types/admin';
const { Sider } = Layout;

export default function Navigation() {
	const [role, setRole] = useState<string[]>([]);

	const navigation = useNavigate();
	const location = useLocation();

	const hasAccess = role.includes(Roles.ADMIN) || role.includes(Roles.MODERATOR);

	let itemsArr: MenuItem[] = [
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
			icon: <BarsOutlined />,
			label: 'Пользователи',
			path: '/todo/users',
		},
	];

	if (!hasAccess) {
		itemsArr.splice(2);
	}

	const defaultKey = itemsArr.find((item) => item.path === location.pathname)?.key || '1';

	const handleClick = (key: string) => {
		const path = itemsArr.find((arr) => arr.key === key)?.path;
		if (path) {
			return navigation(path);
		}
	};

	useEffect(() => {
		const checkRole = async () => {
			try {
				const res = await getProfileUser();
				setRole(res.roles);
			} catch {}
		};
		checkRole();
	}, []);
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
