import { useEffect, useState } from 'react';
import { AxiosError } from 'axios';

import { Link } from 'react-router';
import { Flex, Skeleton, Table, TableProps, Tag, Space, Popconfirm, Button } from 'antd';
import type { SorterResult } from 'antd/es/table/interface';

import { MetaResponse, Roles, User, UserFilters } from '../../types/admin';
import { deleteUser, getListUsers } from '../../api/adminApi';

export const Users = () => {
	const [response, setResponse] = useState<MetaResponse<User>>();
	const [filter, setFilter] = useState<UserFilters>({});

	const getData = async (filters?: UserFilters) => {
		try {
			const response = await getListUsers(filters);
			setResponse(response);
		} catch (error: unknown) {
			if (error instanceof AxiosError) {
			}
		}
	};

	const handleDeleteUser = async (id: number) => {
		try {
			await deleteUser(id);
			getData(filter);
		} catch (error: unknown) {
			if (error instanceof AxiosError) {
			}
		}
	};

	const handleTableChange: TableProps<User>['onChange'] = (_, __, sorter) => {
		const sort = sorter as SorterResult<User>;

		const newFilters: UserFilters = {
			...filter,
			sortBy: sort.order ? (sort.field as string) : undefined,
			sortOrder:
				sort.order === 'ascend' ? 'asc' : sort.order === 'descend' ? 'desc' : undefined,
		};

		setFilter(newFilters);
		getData(newFilters);
	};

	useEffect(() => {
		getData(filter);
	}, []);

	const columns: TableProps<User>['columns'] = [
		{
			title: 'Имя',
			dataIndex: 'username',
			key: 'username',
			sorter: true,
			sortOrder:
				filter?.sortBy === 'username'
					? filter.sortOrder === 'asc'
						? 'ascend'
						: 'descend'
					: null,
		},
		{
			title: 'Email',
			dataIndex: 'email',
			key: 'email',
			sorter: true,
			sortOrder:
				filter?.sortBy === 'email'
					? filter.sortOrder === 'asc'
						? 'ascend'
						: 'descend'
					: null,
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
				<Flex gap="small" align="center" wrap>
					{roles.map((tag) => {
						let color = 'gray';
						if (tag === Roles.ADMIN) color = 'red';
						if (tag === Roles.MODERATOR) color = 'blue';
						if (tag === Roles.USER) color = 'green';
						return (
							<Tag color={color} key={tag}>
								{tag.toUpperCase()}
							</Tag>
						);
					})}
				</Flex>
			),
		},
		{
			title: 'Блокировка',
			dataIndex: 'isBlocked',
			key: 'isBlocked',
			render: (_, { isBlocked }) => (
				<Flex gap="small" align="center" wrap>
					{isBlocked ? <Tag color="red">Забанен</Tag> : <Tag color="green">Живёт</Tag>}
				</Flex>
			),
		},
		{
			title: 'Дата регистрации',
			dataIndex: 'date',
			key: 'date',
			render: (_, { date }) => {
				const dat = new Date(date);
				const day = dat.getDate();
				const monthIndex = dat.getMonth();
				const year = dat.getFullYear();
				return <p>{day + '.' + (monthIndex + 1) + '.' + year}</p>;
			},
		},
		{
			title: 'Действия',
			key: 'action',
			render: (_, record) => (
				<Space size="middle">
					<Popconfirm
						title="Удалить пользователя"
						description="Вы уверены?"
						onConfirm={() => handleDeleteUser(record.id)}
						okText="Да"
						cancelText="Нет">
						<Button danger>Удалить</Button>
					</Popconfirm>
					<Link to={`/todo/users/${record.id}`}>Редактировать</Link>
				</Space>
			),
		},
	];

	return (
		<>
			{response ? (
				<Table
					rowKey="id"
					dataSource={response.data}
					columns={columns}
					onChange={handleTableChange}
				/>
			) : (
				<Skeleton />
			)}
		</>
	);
};
