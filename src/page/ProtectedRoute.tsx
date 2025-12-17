import { useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAppSelector } from '../store/store';

export default function ProtectedRoute() {
	const { isAuth, isLoading } = useAppSelector((s) => s.authorization);

	if (isLoading) {
		return <div>Loading...</div>;
	}

	if (!isAuth) {
		return <Navigate to="/login" replace />;
	}

	return <Outlet />;
}
