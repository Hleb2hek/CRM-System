import { createBrowserRouter } from 'react-router-dom';
import Authorization from './auth/Authorization';
import Registration from './auth/Registration';
import Root from './dashboard/Root';
import TodoListPage from './dashboard/TodoListPage';
import Profile from './dashboard/Profile';
import { ProtectedRoute } from './auth/ProtectedRoute';
import { Users } from './dashboard/Users';
import { UserEdit } from './dashboard/UserEdit';

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
					{ path: 'profile', element: <Profile /> },
					{ path: 'users', element: <Users /> },
					{ path: 'users/:id', element: <UserEdit /> },
				],
			},
		],
	},
]);
