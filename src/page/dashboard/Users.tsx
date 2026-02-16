import { useEffect, useState } from 'react';
import { AxiosError } from 'axios';

import { Link } from 'react-router';
import {
	Flex,
	Skeleton,
	Table,
	TableProps,
	Tag,
	Space,
	Popconfirm,
	Button,
	PopconfirmProps,
} from 'antd';

import { MetaResponse, Roles, User } from '../../types/admin';
import { deleteUser, getListUsers } from '../../api/adminApi';

export const Users = () => {
	const [response, setResponse] = useState<MetaResponse<User>>();

	const getData = async () => {
		try {
			const response = await getListUsers();
			setResponse(response);
		} catch (error: unknown) {
			if (error instanceof AxiosError) {
			}
		}
	};

	const handleDeleteUser = async (id: number) => {
		try {
			await deleteUser(id);
		} catch (error: unknown) {
			if (error instanceof AxiosError) {
			}
		}
	};

	useEffect(() => {
		getData();
	}, []);

	const columns: TableProps<User>['columns'] = [
		{
			title: 'Имя',
			dataIndex: 'username',
			key: 'username',
		},
		{
			title: 'Email',
			dataIndex: 'email',
			key: 'email',
		},
		{
			title: 'Телефон',
			dataIndex: 'phoneNumber',
			key: 'phone number',
		},
		{
			title: 'Роли',
			key: 'roles',
			dataIndex: 'roles',
			render: (_, { roles }) => (
				<Flex gap="small" align="center" wrap>
					{roles.map((tag) => {
						let color = 'orange';
						if (tag === Roles.ADMIN) {
							color = 'red';
						}
						if (tag === Roles.MODERATOR) {
							color = 'blue';
						}
						if (tag === Roles.USER) {
							color = 'green';
						}
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
					{isBlocked ? <Tag color={'red'}>Забанен</Tag> : <Tag color={'green'}>Живёт</Tag>}
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
				const myFormattedDate = day + '.' + (monthIndex + 1) + '.' + year;
				return <p>{myFormattedDate}</p>;
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
			{response ? <Table rowKey="id" dataSource={response.data} columns={columns} /> : <Skeleton />}
		</>
	);
};
