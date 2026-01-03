import { createBrowserRouter } from 'react-router-dom';
import Authorization from './Authorization';
import Registration from './Registration';
import Root from './Root';
import TodoListPage from './TodoListPage';
import Profile from './Profile';
import ProtectedRoute from './ProtectedRoute';

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
				],
			},
		],
	},
]);
