import { useEffect, useState } from 'react';
import { getListUsers } from '../../api/adminApi';
import { MetaResponse, User } from '../../types/admin';

export const Users = () => {
	const [us, setUs] = useState<MetaResponse<User> | []>([]);
	const usersad = async () => {
		try {
			const resp = await getListUsers();
			setUs(resp);
		} catch {}
	};

	useEffect(() => {
		usersad();
	}, [us]);

	const data = [
		{
			id: 1,
			username: 'asdasd',
			email: 'asdasd@sadsad.com',
			date: '1.1.1.1',
			isBlocked: false,
			roles: ['User'],
			phoneNumber: 213123123123,
		},
	];
	console.log(data[0]);
	return (
		<div>
			<ul>{data[0].date}</ul>
		</div>
	);
};
