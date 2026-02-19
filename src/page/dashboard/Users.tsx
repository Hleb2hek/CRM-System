import { useCallback, useEffect, useState, type CSSProperties } from 'react';
import { AxiosError } from 'axios';
import { useNavigate } from 'react-router';
import {
	Flex,
	Skeleton,
	Table,
	Tag,
	Space,
	Popconfirm,
	Button,
	type MenuProps,
	Dropdown,
	Typography,
	Row,
	Col,
	Input,
	Tooltip,
	Modal,
	Select,
	type SelectProps,
} from 'antd';
import type { ColumnsType, SorterResult } from 'antd/es/table/interface';
import { SearchOutlined, FilterOutlined, DeleteOutlined, MoreOutlined } from '@ant-design/icons';
import { debounce } from 'lodash';

import { MetaResponse, Roles, User, UserFilters } from '../../types/admin';
import {
	blockUser,
	deleteUser,
	getListUsers,
	unblockUser,
	updateUserRoles,
} from '../../api/adminApi';

const { Title } = Typography;

const selectedMenuItemStyle: CSSProperties = {
	color: '#1777FF',
	backgroundColor: '#E6f4FF',
};

const getHeading = (isBlocked?: boolean) => {
	if (isBlocked === true) return 'Заблокированные пользователи';
	if (isBlocked === false) return 'Незаблокированные пользователи';
	return 'Все пользователи';
};

const getRoleColor = (role: Roles) => {
	if (role === Roles.ADMIN) return 'red';
	if (role === Roles.MODERATOR) return 'blue';
	return 'green';
};

const formatDate = (date: string) => {
	const dat = new Date(date);
	return `${dat.getDate()}.${dat.getMonth() + 1}.${dat.getFullYear()}`;
};

const roleSelectOptions: SelectProps['options'] = Object.values(Roles).map((role) => ({
	value: role,
	label: role,
}));

export const Users = () => {
	const [usersResponse, setUsersResponse] = useState<MetaResponse<User>>();
	const [usersFilter, setUsersFilter] = useState<UserFilters>({});
	const [usersLoading, setUsersLoading] = useState<boolean>(false);
	const [selectedUser, setSelectedUser] = useState<User | null>(null);
	const [currentRoles, setCurrentRoles] = useState<Roles[]>([]);
	const navigate = useNavigate();

	const fetchUsers = useCallback(async (queryParams: UserFilters) => {
		setUsersLoading(true);
		try {
			const { offset, ...rest } = queryParams;
			const newUsersList = await getListUsers({
				...rest,
				page: offset !== undefined ? offset + 1 : undefined,
			});
			setUsersResponse(newUsersList);
		} catch (error) {
			if (error instanceof AxiosError) console.error(error);
		} finally {
			setUsersLoading(false);
		}
	}, []);

	const handleDeleteUser = async (id: number) => {
		try {
			await deleteUser(id);
			fetchUsers(usersFilter);
		} catch (error) {
			if (error instanceof AxiosError) console.error(error);
		}
	};

	const handleBlockUser = async (id: number) => {
		try {
			await blockUser(id);
			fetchUsers(usersFilter);
		} catch (error) {
			if (error instanceof AxiosError) console.error(error);
		}
	};

	const handleUnblockUser = async (id: number) => {
		try {
			await unblockUser(id);
			fetchUsers(usersFilter);
		} catch (error) {
			if (error instanceof AxiosError) console.error(error);
		}
	};

	const handleRolesModalOk = async () => {
		if (!selectedUser) return;
		try {
			await updateUserRoles(selectedUser.id, { roles: currentRoles });
			setSelectedUser(null);
			fetchUsers(usersFilter);
		} catch (error) {
			if (error instanceof AxiosError) console.error(error);
			setSelectedUser(null);
		}
	};

	const handleRolesModalCancel = () => {
		setSelectedUser(null);
	};

	const handleSearchDebounced = useCallback(
		debounce((value: string) => {
			setUsersFilter((prev) => ({ ...prev, search: value, offset: undefined }));
		}, 500),
		[],
	);

	const handleSortChange = (
		_: unknown,
		__: unknown,
		sorter: SorterResult<User> | SorterResult<User>[],
	) => {
		const sort = sorter as SorterResult<User>;
		const sortOrder = sort.order?.slice(0, -3);
		if (sortOrder === 'asc' || sortOrder === 'desc') {
			setUsersFilter((prev) => ({ ...prev, sortOrder, sortBy: sort.field?.toString() ?? 'id' }));
		} else {
			setUsersFilter((prev) => ({ ...prev, sortOrder: undefined, sortBy: undefined }));
		}
	};

	const handlePageChange = (page: number, pageSize: number) => {
		setUsersFilter((prev) => ({
			...prev,
			offset: page === 1 ? undefined : page - 1,
			limit: pageSize,
		}));
	};

	useEffect(() => {
		fetchUsers(usersFilter);
	}, [usersFilter]);

	const columns: ColumnsType<User> = [
		{
			title: 'Имя',
			dataIndex: 'username',
			key: 'username',
			sorter: true,
			render: (_, { username }) => <div style={{ width: '200px' }}>{username}</div>,
		},
		{
			title: 'Email',
			dataIndex: 'email',
			key: 'email',
			sorter: true,
		},
		{
			title: 'Телефон',
			dataIndex: 'phoneNumber',
			key: 'phoneNumber',
		},
		{
			title: 'Роли',
			key: 'roles',
			dataIndex: 'roles',
			render: (_, { roles }) => (
				<Space size={[4, 16]} direction="horizontal" wrap style={{ width: '170px' }}>
					{roles.map((role) => (
						<Tag color={getRoleColor(role)} key={role}>
							{role.toUpperCase()}
						</Tag>
					))}
				</Space>
			),
		},
		{
			title: 'Статус',
			dataIndex: 'isBlocked',
			key: 'isBlocked',
			render: (_, { isBlocked }) =>
				isBlocked ? <Tag color="red">Заблокирован</Tag> : <Tag color="green">Активен</Tag>,
		},
		{
			title: 'Дата регистрации',
			dataIndex: 'date',
			key: 'date',
			render: (_, { date }) => <p>{formatDate(date)}</p>,
		},
		{
			title: 'Действия',
			key: 'action',
			width: '170px',
			render: (_, record) => (
				<Space size="middle">
					<Tooltip title="Перейти к профилю">
						<Button
							variant="outlined"
							color="default"
							style={{ border: '1px solid black' }}
							onClick={() => navigate(`/todo/users/${record.id}`)}>
							→
						</Button>
					</Tooltip>

					<Popconfirm
						title="Удалить пользователя"
						description="Вы уверены?"
						onConfirm={() => handleDeleteUser(record.id)}
						okText="Да"
						cancelText="Нет">
						<Tooltip title="Удалить пользователя">
							<Button danger>
								<DeleteOutlined />
							</Button>
						</Tooltip>
					</Popconfirm>

					<Dropdown
						trigger={['click']}
						menu={{
							items: [
								{
									key: 'changeBlockStatus',
									label: !record.isBlocked ? (
										<Popconfirm
											okText="Да"
											cancelText="Нет"
											title="Заблокировать пользователя?"
											onConfirm={() => handleBlockUser(record.id)}>
											Заблокировать
										</Popconfirm>
									) : (
										<Popconfirm
											okText="Да"
											cancelText="Нет"
											title="Разблокировать пользователя?"
											onConfirm={() => handleUnblockUser(record.id)}>
											Разблокировать
										</Popconfirm>
									),
								},
								{
									key: 'editRoles',
									label: (
										<p
											onClick={() => {
												setSelectedUser(record);
												setCurrentRoles(record.roles);
											}}>
											Изменить роли
										</p>
									),
								},
							],
						}}>
						<MoreOutlined />
					</Dropdown>

					<Modal
						destroyOnHidden
						title="Роли пользователя"
						open={selectedUser?.id === record.id}
						onOk={handleRolesModalOk}
						onCancel={handleRolesModalCancel}
						okText="Сохранить"
						cancelText="Отмена">
						<Select
							mode="multiple"
							style={{ width: '100%' }}
							placeholder="Выберите роли"
							options={roleSelectOptions}
							value={currentRoles}
							onChange={(values) => setCurrentRoles(values)}
						/>
					</Modal>
				</Space>
			),
		},
	];

	const filterMenuItems: MenuProps['items'] = [
		{
			label: 'Все',
			key: 'all',
			onClick: () =>
				setUsersFilter((prev) => ({ ...prev, isBlocked: undefined, offset: undefined })),
			style: usersFilter.isBlocked === undefined ? selectedMenuItemStyle : undefined,
		},
		{
			label: 'Заблокированные',
			key: 'blocked',
			onClick: () => setUsersFilter((prev) => ({ ...prev, isBlocked: true, offset: undefined })),
			style: usersFilter.isBlocked === true ? selectedMenuItemStyle : undefined,
		},
		{
			label: 'Незаблокированные',
			key: 'unblocked',
			onClick: () => setUsersFilter((prev) => ({ ...prev, isBlocked: false, offset: undefined })),
			style: usersFilter.isBlocked === false ? selectedMenuItemStyle : undefined,
		},
	];

	return (
		<Flex vertical style={{ width: '100%' }}>
			<Title>Пользователи</Title>
			<Flex vertical style={{ border: '1px solid #E4E4E4', borderRadius: 10, padding: '1.5rem' }}>
				<Row style={{ paddingBottom: '1rem' }}>
					<Col span={10}>
						<Title level={3}>{getHeading(usersFilter.isBlocked)}</Title>
					</Col>
					<Col span={14}>
						<Flex gap="1rem">
							<Input
								prefix={<SearchOutlined />}
								size="large"
								placeholder="Поиск по имени или email"
								defaultValue={usersFilter.search}
								onChange={(e) => handleSearchDebounced(e.currentTarget.value)}
							/>
							<Dropdown menu={{ items: filterMenuItems }}>
								<Button style={{ minWidth: '12ch', border: '2px solid black', height: '2.5rem' }}>
									<Space>
										<FilterOutlined />
										<p>Фильтр</p>
									</Space>
								</Button>
							</Dropdown>
						</Flex>
					</Col>
				</Row>
				{usersResponse ? (
					<Table
						rowKey="id"
						tableLayout="fixed"
						loading={usersLoading}
						dataSource={usersResponse.data}
						columns={columns}
						size="middle"
						scroll={{ x: 'max-content', y: '60vh' }}
						pagination={{
							current: (usersFilter.offset && usersFilter.offset + 1) ?? 1,
							defaultPageSize: 20,
							total: usersResponse.meta.totalAmount,
							onChange: handlePageChange,
						}}
						onChange={handleSortChange}
					/>
				) : (
					<Skeleton active />
				)}
			</Flex>
		</Flex>
	);
};
