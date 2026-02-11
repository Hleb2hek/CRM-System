export type ContextType = { hasAccess: boolean };
import { useEffect, useState } from 'react';
import { Table, Tag, Spin, Space, Button, Alert, Popconfirm } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';

import { getListUsers, deleteUser } from '../../api/adminApi';
import { User, MetaResponse, Roles, UserFilters } from '../../types/admin';
import { AxiosError } from 'axios';

const roleColors: Record<Roles, string> = {
	[Roles.USER]: 'green',
	[Roles.ADMIN]: 'red',
	[Roles.MODERATOR]: 'blue',
};

export const Users = () => {
	const navigate = useNavigate();

	const [response, setResponse] = useState<MetaResponse<User>>({
		data: [],
		meta: { totalAmount: 0, sortBy: '', sortOrder: 'asc' },
	});

	const [filters, setFilters] = useState<UserFilters>({
		search: '',
		page: 1,
		limit: 20,
		sortBy: '',
		sortOrder: 'asc',
		isBlocked: false,
	});

	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');
	const [success, setSuccess] = useState('');

	const loadUsers = async (params: UserFilters) => {
		setLoading(true);
		setError('');

		try {
			const data = await getListUsers(params);
			setResponse(data);
		} catch (err: unknown) {
			const msg =
				err instanceof AxiosError
					? err.message || 'Ошибка загрузки'
					: 'Не удалось загрузить пользователей';
			setError(msg);
		} finally {
			setLoading(false);
		}
	};

	const handleDelete = async (id: number) => {
		try {
			await deleteUser(id);
			setSuccess('Пользователь удалён');
			loadUsers(filters);
		} catch (err: unknown) {
			setError(err instanceof AxiosError ? err.message || 'Не удалось удалить' : 'Ошибка удаления');
		}
	};

	const handleTableChange = (pagination: any, _filters: any, sorter: any) => {
		const sort = Array.isArray(sorter) ? sorter[0] : sorter;

		setFilters((prev) => ({
			...prev,
			page: pagination.current ?? 1,
			limit: pagination.pageSize ?? prev.limit,
			sortBy: sort?.field ? String(sort.field) : '',
			sortOrder: sort?.order === 'ascend' ? 'asc' : sort?.order === 'descend' ? 'desc' : 'asc',
		}));
	};

	const columns: ColumnsType<User> = [
		{
			title: 'Имя',
			dataIndex: 'username',
			key: 'username',
			sorter: true,
		},
		{
			title: 'Email',
			dataIndex: 'email',
			key: 'email',
			sorter: true,
		},
		{
			title: 'Дата регистрации',
			dataIndex: 'createdAt',
			key: 'createdAt',
			render: (date?: string) => (date ? dayjs(date).format('DD.MM.YYYY HH:mm') : '—'),
			width: 170,
		},
		{
			title: 'Статус',
			key: 'isBlocked',
			render: (_, record) => (
				<Tag color={record.isBlocked ? 'red' : 'green'}>
					{record.isBlocked ? 'Заблокирован' : 'Активен'}
				</Tag>
			),
			width: 140,
		},
		{
			title: 'Роли',
			key: 'roles',
			render: (_, record: User) =>
				record.roles?.length ? (
					<Space size={[0, 4]} wrap>
						{record.roles.map((role) => (
							<Tag color={roleColors[role as Roles]} key={role}>
								{role}
							</Tag>
						))}
					</Space>
				) : (
					<Tag color="default">Нет ролей</Tag>
				),
		},
		{
			title: 'Телефон',
			dataIndex: 'phoneNumber',
			key: 'phoneNumber',
			render: (phone?: string) => phone || '—',
		},
		{
			title: 'Действия',
			key: 'actions',
			fixed: 'right',
			width: 220,
			render: (_, record: User) => (
				<Space>
					<Button type="link" onClick={() => navigate(`/todo/users/${record.id}`)}>
						Профиль
					</Button>

					<Popconfirm
						title="Удалить пользователя?"
						description="Действие нельзя отменить"
						okText="Удалить"
						cancelText="Отмена"
						okButtonProps={{ danger: true }}
						onConfirm={() => handleDelete(record.id)}>
						<Button danger type="link">
							Удалить
						</Button>
					</Popconfirm>
				</Space>
			),
		},
	];

	useEffect(() => {
		loadUsers(filters);
	}, [filters]);

	return (
		<div style={{ padding: 16 }}>
			{success && (
				<Alert
					message={success}
					type="success"
					showIcon
					closable
					onClose={() => setSuccess('')}
					style={{ marginBottom: 16 }}
				/>
			)}

			{error && (
				<Alert
					message={error}
					type="error"
					showIcon
					closable
					onClose={() => setError('')}
					style={{ marginBottom: 16 }}
				/>
			)}

			<Table<User>
				columns={columns}
				dataSource={response.data}
				rowKey="id"
				loading={loading ? { indicator: <Spin size="large" /> } : false}
				onChange={handleTableChange}
				pagination={{
					current: filters.page,
					pageSize: filters.limit,
					total: response.meta.totalAmount,
					showSizeChanger: true,
					pageSizeOptions: ['10', '20', '50', '100'],
					showTotal: (total) => `Всего: ${total}`,
					position: ['bottomRight'],
				}}
				scroll={{ x: 1000 }}
			/>
		</div>
	);
};
