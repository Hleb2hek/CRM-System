import { createBrowserRouter } from 'react-router';
import TodoListPage from './TodoListPage';
import Profile from './Profile';
import Root from './Root';
import Authorization from '../store/authorization/Authorization';
import Registration from '../store/registration/Registration';

export const root = createBrowserRouter([
	{
		path: '/',
		element: <Authorization />,
	},
	{
		path: '/registration',
		element: <Registration />,
	},
	{
		path: 'todo',
		element: <Root />,
		children: [
			{ index: true, element: <TodoListPage /> },
			{ path: 'profile', element: <Profile /> },
		],
	},
]);
