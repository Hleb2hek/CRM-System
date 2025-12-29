import { createBrowserRouter } from 'react-router-dom';
import Authorization from '../store/authorization/Authorization';
import Registration from '../store/registration/Registration';
import Root from './Root';
import TodoListPage from './TodoListPage';
import Profile from './Profile';
import ProtectedRoute from './ProtectedRoute';
import RefreshToken from './RefreshToken';

export const root = createBrowserRouter([
	{
		element: <RefreshToken />,
		children: [
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
		],
	},
]);
