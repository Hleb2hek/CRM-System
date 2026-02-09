import { useEffect, useState } from 'react';
import { Table, Tag, Spin, Tooltip, Space, Button } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { User, MetaResponse, Roles } from '../../types/admin';
import { getListUsers } from '../../api/adminApi';
import { useNavigate } from 'react-router';

const roleColors: Record<Roles, string> = {
	[Roles.USER]: 'green',
	[Roles.ADMIN]: 'red',
	[Roles.MODERATOR]: 'blue',
};

export const Users = () => {
	const [response, setResponse] = useState<MetaResponse<User>>({
		data: [],
		meta: {
			totalAmount: 0,
			sortBy: '',
			sortOrder: 'asc',
		},
	});

	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const navigate = useNavigate();

	const columns: ColumnsType<User> = [
		{
			title: 'Имя',
			dataIndex: 'username',
			key: 'username',
			sorter: (a, b) => a.username.localeCompare(b.username),
			width: 180,
		},
		{
			title: 'Email',
			dataIndex: 'email',
			key: 'email',
			sorter: (a, b) => a.email.localeCompare(b.email),
			width: 220,
			render: (email: string) => (
				<a
					href={`mailto:${email}`}
					style={{ textDecoration: 'underline', color: 'black', fontWeight: 'bold' }}>
					{email}
				</a>
			),
		},
		{
			title: 'Телефон',
			dataIndex: 'phoneNumber',
			key: 'phoneNumber',
			width: 160,
			render: (phone?: string) =>
				phone ? (
					<Tooltip title={phone}>
						<span>{phone}</span>
					</Tooltip>
				) : (
					'—'
				),
		},
		{
			title: 'Роли',
			key: 'roles',
			width: 220,
			render: (_, record: User) => {
				if (!record.roles?.length) {
					return <Tag color="default">Нет ролей</Tag>;
				}

				return (
					<Space size={[0, 4]} wrap>
						{record.roles.map((role) => {
							const roleName = typeof role === 'string' ? role : role;
							const color = roleColors[role as Roles];

							return (
								<Tag color={color} key={roleName}>
									{roleName}
								</Tag>
							);
						})}
					</Space>
				);
			},
		},
		{
			title: 'Блокировка',
			dataIndex: 'isBlocked',
			key: 'isBlocked',
			width: 140,
			filters: [
				{ text: 'Заблокирован', value: true },
				{ text: 'Активен', value: false },
			],
			onFilter: (value, record) => record.isBlocked === value,
			render: (isBlocked: boolean) => (
				<Tag color={isBlocked ? 'error' : 'success'}>
					{isBlocked ? 'Заблокирован' : 'Активен'}
				</Tag>
			),
		},
		{
			title: 'Дата регистрации',
			dataIndex: 'date',
			key: 'date',
			sorter: (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
			render: (date: string) => new Date(date).toLocaleDateString('ru-RU'),
			width: 140,
		},
		{
			title: 'Профиль',
			key: 'profile',
			width: 180,
			fixed: 'right',
			render: (_, record: User) => (
				<Button type="link" onClick={() => navigate(`/todo/users/${record.id}`)}>
					Перейти к профилю
				</Button>
			),
		},
	];

	const loadUsers = async () => {
		setLoading(true);
		setError(null);
		try {
			const data = await getListUsers();
			setResponse(data);
		} catch (err: any) {
			setError('Не удалось загрузить список пользователей');
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		loadUsers();
	}, []);

	return (
		<div>
			{error && <div style={{ color: 'red', marginBottom: 16 }}>{error}</div>}

			<Table<User>
				columns={columns}
				dataSource={response.data}
				rowKey="id"
				loading={loading ? { indicator: <Spin size="large" /> } : false}
				pagination={{
					total: response.meta.totalAmount,
					showSizeChanger: true,
					showTotal: (total) => `Всего пользователей: ${total}`,
				}}
			/>
		</div>
	);
};
