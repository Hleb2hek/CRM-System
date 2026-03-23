import { useLocation, useNavigate } from 'react-router-dom';

import { Layout, Menu } from 'antd';
import { UnorderedListOutlined, UserOutlined, UsergroupAddOutlined } from '@ant-design/icons';
import { MenuItem } from '../../types/todo';
import { Roles } from '../../types/admin';
import { useEffect, useState } from 'react';
import { getProfileUser } from '../../api/usersApi';
const { Sider } = Layout;

const NAVIGATION_TEXT = {
	TASKS_LIST: 'Список задач',
	PROFILE: 'Профиль',
	USERS: 'Пользователи',
};

export default function Navigation() {
	const [roles, setRoles] = useState<string[]>([]);

	const navigate = useNavigate();
	const location = useLocation();

	let itemsArray: MenuItem[] = [
		{
			key: '1',
			icon: <UnorderedListOutlined />,
			label: NAVIGATION_TEXT.TASKS_LIST,
			path: '/todo',
		},
		{
			key: '2',
			icon: <UserOutlined />,
			label: NAVIGATION_TEXT.PROFILE,
			path: '/todo/profile',
		},
		{
			key: '3',
			icon: <UsergroupAddOutlined />,
			label: NAVIGATION_TEXT.USERS,
			path: '/todo/users',
		},
	];
	const hasAccess = roles.includes(Roles.ADMIN) || roles.includes(Roles.MODERATOR);

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

	useEffect(() => {
		const role = async () => {
			const res = await getProfileUser();
			setRoles(res.roles);
		};
		role();
	}, []);
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
