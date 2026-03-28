import { createBrowserRouter } from 'react-router-dom';
import Authorization from '../pages/auth/Authorization';
import Registration from '../pages/auth/Registration';
import Root from '../pages/navigation/RootNavigation';
import TodoListPage from '../pages/todo/TodoListPage';
import ProfileUser from '../pages/profile/Profile';
import { ProtectedRoute } from '../pages/auth/ProtectedRoute';
import { Users } from '../pages/users/Users';
import { UserEdit } from '../pages/users/UserEdit';

export const root = createBrowserRouter([
	{ path: '/', element: <Authorization /> },
	{ path: '/registration', element: <Registration /> },
	{
		element: <ProtectedRoute />,
		children: [
			{
				path: '/todo',
				element: <Root />,
				children: [
					{ index: true, element: <TodoListPage /> },
					{ path: 'profile', element: <ProfileUser /> },
					{ path: 'users', element: <Users /> },
					{ path: 'users/:id', element: <UserEdit /> },
				],
			},
		],
	},
]);
