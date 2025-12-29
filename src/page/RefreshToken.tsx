import { useEffect } from 'react';
import { Outlet } from 'react-router';
import { useAppDispatch } from '../store/store';
import { initAuth } from '../store/authorization/authSlice';

export default function RefreshToken() {
	const dispatch = useAppDispatch();

	useEffect(() => {
		dispatch(initAuth());
	}, [dispatch]);

	return <Outlet />;
}
