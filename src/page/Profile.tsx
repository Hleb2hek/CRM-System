import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/store';
import { getProfile } from '../store/profile/profileSlice';

export default function Profile() {
	const dispatch = useAppDispatch();
	const { data, loading, error } = useAppSelector((state) => state.profile);

	useEffect(() => {
		dispatch(getProfile());
	}, [dispatch]);

	if (loading) {
		return <p>Загрузка...</p>;
	}
	if (error) {
		return <p>{error}</p>;
	}
	if (!data) {
		return null;
	}

	return (
		<>
			<h1>{data.username}</h1>
			<p>{data.email}</p>
			<p>{data.phoneNumber}</p>
		</>
	);
}
