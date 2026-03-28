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
	Alert,
} from 'antd';
import { SearchOutlined, FilterOutlined, DeleteOutlined, MoreOutlined } from '@ant-design/icons';
import type { ColumnsType, SorterResult } from 'antd/es/table/interface';

import { debounce } from 'lodash';

import { Roles, User, UserFilters } from '../../types/admin';

import {
	blockUser,
	deleteUser,
	getListUsers,
	unblockUser,
	updateUserRoles,
} from '../../api/adminApi';
import { format } from 'date-fns';
import { MetaResponse } from '../../types/todo';

const { Title } = Typography;

const USERS_PAGE_TEXT = {
	TITLE: 'Пользователи',

	HEADING_ALL: 'Все пользователи',
	HEADING_BLOCKED: 'Заблокированные пользователи',
	HEADING_UNBLOCKED: 'Незаблокированные пользователи',

	USERNAME: 'Имя',
	EMAIL: 'Email',
	PHONE: 'Телефон',
	ROLES: 'Роли',
	STATUS: 'Статус',
	REGISTRATION_DATE: 'Дата регистрации',
	ACTIONS: 'Действия',

	STATUS_BLOCKED: 'Заблокирован',
	STATUS_ACTIVE: 'Активен',

	GO_TO_PROFILE: 'Перейти к профилю',

	DELETE_USER: 'Удалить пользователя',
	DELETE_CONFIRM: 'Вы уверены?',
	DELETE_TOOLTIP: 'Удалить пользователя',

	BLOCK_USER: 'Заблокировать',
	UNBLOCK_USER: 'Разблокировать',

	BLOCK_CONFIRM: 'Заблокировать пользователя?',
	UNBLOCK_CONFIRM: 'Разблокировать пользователя?',

	EDIT_ROLES: 'Изменить роли',
	USER_ROLES_MODAL: 'Роли пользователя',

	SAVE: 'Сохранить',
	CANCEL: 'Отмена',

	SELECT_ROLES: 'Выберите роли',

	FILTER: 'Фильтр',
	FILTER_ALL: 'Все',
	FILTER_BLOCKED: 'Заблокированные',
	FILTER_UNBLOCKED: 'Незаблокированные',

	SEARCH_PLACEHOLDER: 'Поиск по имени или email',

	YES: 'Да',
	NO: 'Нет',

	USERS_LOADED: 'Список пользователей загружен',
	USER_DELETED: 'Пользователь успешно удалён',
	USER_BLOCKED: 'Пользователь заблокирован',
	USER_UNBLOCKED: 'Пользователь разблокирован',
	ROLES_UPDATED: 'Роль(и) пользователя обновлены',
};

const selectedMenuItemStyle: CSSProperties = {
	color: '#1777FF',
	backgroundColor: '#E6f4FF',
};

const getHeading = (isBlocked?: boolean) => {
	if (isBlocked === true) return USERS_PAGE_TEXT.HEADING_BLOCKED;
	if (isBlocked === false) return USERS_PAGE_TEXT.HEADING_UNBLOCKED;
	return USERS_PAGE_TEXT.HEADING_ALL;
};

const getRoleColor = (role: Roles) => {
	if (role === Roles.ADMIN) return 'red';
	if (role === Roles.MODERATOR) return 'blue';
	return 'green';
};

const roleSelectOptions: SelectProps['options'] = Object.values(Roles).map((role) => ({
	value: role,
	label: role,
}));

export const Users = () => {
	const [usersResponse, setUsersResponse] = useState<MetaResponse<User>>();
	const [usersFilter, setUsersFilter] = useState<UserFilters>({});
	const [isLoading, setIsLoading] = useState<boolean>(false);

	const [selectedUser, setSelectedUser] = useState<User | null>(null);
	const [currentRoles, setCurrentRoles] = useState<Roles[]>([]);

	const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

	const navigate = useNavigate();

	const showAlert = (type: 'success' | 'error', message: string) => {
		setAlert({ type, message });
		setTimeout(() => setAlert(null), 4500);
	};

	const fetchUsers = useCallback(async (queryParams: UserFilters) => {
		setIsLoading(true);
		try {
			const { offset, ...rest } = queryParams;

			const response = await getListUsers({
				...rest,
				page: offset !== undefined ? offset + 1 : undefined,
			});

			const normalizedData = response.data.map((user: User) => ({
				...user,
				roles: user.roles?.length ? user.roles : [Roles.USER],
			}));

			setUsersResponse({
				...response,
				data: normalizedData,
			});

			showAlert('success', USERS_PAGE_TEXT.USERS_LOADED);
		} catch (error) {
			if (error instanceof AxiosError) {
				showAlert('error', error.message);
			}
		} finally {
			setIsLoading(false);
		}
	}, []);

	const handleDeleteUser = async (id: number) => {
		try {
			await deleteUser(id);
			fetchUsers(usersFilter);
			showAlert('success', USERS_PAGE_TEXT.USER_DELETED);
		} catch (error) {
			if (error instanceof AxiosError) {
				showAlert('error', error.message);
			}
		}
	};

	const handleBlockUser = async (id: number) => {
		try {
			await blockUser(id);
			fetchUsers(usersFilter);
			showAlert('success', USERS_PAGE_TEXT.USER_BLOCKED);
		} catch (error) {
			if (error instanceof AxiosError) {
				showAlert('error', error.message);
			}
		}
	};

	const handleUnblockUser = async (id: number) => {
		try {
			await unblockUser(id);
			fetchUsers(usersFilter);
			showAlert('success', USERS_PAGE_TEXT.USER_UNBLOCKED);
		} catch (error) {
			if (error instanceof AxiosError) {
				showAlert('error', error.message);
			}
		}
	};

	const handleRolesModalOk = async () => {
		if (!selectedUser) return;

		try {
			await updateUserRoles(selectedUser.id, { roles: currentRoles });
			setSelectedUser(null);
			fetchUsers(usersFilter);
			showAlert('success', USERS_PAGE_TEXT.ROLES_UPDATED);
		} catch (error) {
			if (error instanceof AxiosError) {
				showAlert('error', error.message);
				setSelectedUser(null);
			}
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
			setUsersFilter((prev) => ({
				...prev,
				sortOrder,
				sortBy: sort.field?.toString() ?? 'id',
			}));
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
			title: USERS_PAGE_TEXT.USERNAME,
			dataIndex: 'username',
			key: 'username',
			sorter: true,
			render: (_, { username }) => <div style={{ width: '200px' }}>{username}</div>,
		},
		{
			title: USERS_PAGE_TEXT.EMAIL,
			dataIndex: 'email',
			key: 'email',
			sorter: true,
		},
		{
			title: USERS_PAGE_TEXT.PHONE,
			dataIndex: 'phoneNumber',
			key: 'phoneNumber',
		},
		{
			title: USERS_PAGE_TEXT.ROLES,
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
			title: USERS_PAGE_TEXT.STATUS,
			dataIndex: 'isBlocked',
			key: 'isBlocked',
			render: (_, { isBlocked }) =>
				isBlocked ? (
					<Tag color="red">{USERS_PAGE_TEXT.STATUS_BLOCKED}</Tag>
				) : (
					<Tag color="green">{USERS_PAGE_TEXT.STATUS_ACTIVE}</Tag>
				),
		},
		{
			title: USERS_PAGE_TEXT.REGISTRATION_DATE,
			dataIndex: 'date',
			key: 'date',
			render: (_, { date }) => <p>{format(date, 'MM/dd/yyyy')}</p>,
		},
		{
			title: USERS_PAGE_TEXT.ACTIONS,
			key: 'action',
			width: '170px',
			render: (_, record) => (
				<Space size="middle">
					<Tooltip title={USERS_PAGE_TEXT.GO_TO_PROFILE}>
						<Button
							variant="outlined"
							color="default"
							style={{ border: '1px solid black' }}
							onClick={() => navigate(`/todo/users/${record.id}`)}>
							→
						</Button>
					</Tooltip>

					<Popconfirm
						title={USERS_PAGE_TEXT.DELETE_USER}
						description={USERS_PAGE_TEXT.DELETE_CONFIRM}
						onConfirm={() => handleDeleteUser(record.id)}
						okText={USERS_PAGE_TEXT.YES}
						cancelText={USERS_PAGE_TEXT.NO}>
						<Tooltip title={USERS_PAGE_TEXT.DELETE_TOOLTIP}>
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
											okText={USERS_PAGE_TEXT.YES}
											cancelText={USERS_PAGE_TEXT.NO}
											title={USERS_PAGE_TEXT.BLOCK_CONFIRM}
											onConfirm={() => handleBlockUser(record.id)}>
											{USERS_PAGE_TEXT.BLOCK_USER}
										</Popconfirm>
									) : (
										<Popconfirm
											okText={USERS_PAGE_TEXT.YES}
											cancelText={USERS_PAGE_TEXT.NO}
											title={USERS_PAGE_TEXT.UNBLOCK_CONFIRM}
											onConfirm={() => handleUnblockUser(record.id)}>
											{USERS_PAGE_TEXT.UNBLOCK_USER}
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
											{USERS_PAGE_TEXT.EDIT_ROLES}
										</p>
									),
								},
							],
						}}>
						<MoreOutlined />
					</Dropdown>

					<Modal
						destroyOnHidden
						title={USERS_PAGE_TEXT.USER_ROLES_MODAL}
						open={selectedUser?.id === record.id}
						onOk={handleRolesModalOk}
						onCancel={handleRolesModalCancel}
						okText={USERS_PAGE_TEXT.SAVE}
						cancelText={USERS_PAGE_TEXT.CANCEL}>
						<Select
							mode="multiple"
							style={{ width: '100%' }}
							placeholder={USERS_PAGE_TEXT.SELECT_ROLES}
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
			label: USERS_PAGE_TEXT.FILTER_ALL,
			key: 'all',
			onClick: () =>
				setUsersFilter((prev) => ({ ...prev, isBlocked: undefined, offset: undefined })),
			style: usersFilter.isBlocked === undefined ? selectedMenuItemStyle : undefined,
		},
		{
			label: USERS_PAGE_TEXT.FILTER_BLOCKED,
			key: 'blocked',
			onClick: () =>
				setUsersFilter((prev) => ({ ...prev, isBlocked: true, offset: undefined })),
			style: usersFilter.isBlocked === true ? selectedMenuItemStyle : undefined,
		},
		{
			label: USERS_PAGE_TEXT.FILTER_UNBLOCKED,
			key: 'unblocked',
			onClick: () =>
				setUsersFilter((prev) => ({ ...prev, isBlocked: false, offset: undefined })),
			style: usersFilter.isBlocked === false ? selectedMenuItemStyle : undefined,
		},
	];

	return (
		<Flex vertical style={{ width: '100%' }}>
			<Title>{USERS_PAGE_TEXT.TITLE}</Title>

			<Flex
				vertical
				style={{ border: '1px solid #E4E4E4', borderRadius: 10, padding: '1.5rem' }}>
				<Row style={{ paddingBottom: '1rem' }}>
					<Col span={10}>
						<Title level={3}>{getHeading(usersFilter.isBlocked)}</Title>
					</Col>

					<Col span={14}>
						<Flex gap="1rem">
							<Input
								prefix={<SearchOutlined />}
								size="large"
								placeholder={USERS_PAGE_TEXT.SEARCH_PLACEHOLDER}
								defaultValue={usersFilter.search}
								onChange={(e) => handleSearchDebounced(e.currentTarget.value)}
								allowClear
							/>

							<Dropdown menu={{ items: filterMenuItems }}>
								<Button
									style={{
										minWidth: '12ch',
										border: '2px solid black',
										height: '2.5rem',
									}}>
									<Space>
										<FilterOutlined />
										{USERS_PAGE_TEXT.FILTER}
									</Space>
								</Button>
							</Dropdown>
						</Flex>
					</Col>
				</Row>

				{alert && (
					<Alert
						message={alert.message}
						type={alert.type}
						showIcon
						closable
						onClose={() => setAlert(null)}
						style={{ marginBottom: 16 }}
					/>
				)}

				{usersResponse ? (
					<Table
						rowKey="id"
						tableLayout="fixed"
						loading={isLoading}
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
