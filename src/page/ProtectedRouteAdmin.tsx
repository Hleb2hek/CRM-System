import { Navigate, Outlet } from 'react-router-dom';
import { getProfileUser } from '../api/usersApi';
import { Roles } from '../types/admin';
import { useEffect, useState } from 'react';

const ProtectedRouteAdmin = () => {
	const [role, setRole] = useState<string[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const checkRole = async () => {
			try {
				const res = await getProfileUser();
				setRole(res.roles);
			} finally {
				setLoading(false);
			}
		};
		checkRole();
	}, []);

	if (loading) {
		return null;
	}

	const hasAccess = role.includes(Roles.ADMIN) || role.includes(Roles.MODERATOR);
	if (!hasAccess) {
		return <Navigate to="" replace />;
	}
	return <Outlet />;
};

export default ProtectedRouteAdmin;
