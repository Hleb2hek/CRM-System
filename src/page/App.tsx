import { createBrowserRouter, redirect } from 'react-router-dom';
import Authorization from '../store/authorization/Authorization';
import Registration from '../store/registration/Registration';
import Root from './Root';
import TodoListPage from './TodoListPage';
import Profile from './Profile';

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
		path: '/todo',
		element: <Root />,
		children: [
			{
				index: true,
				element: <TodoListPage />,
			},
			{
				path: 'profile',
				element: <Profile />,
			},
		],
	},
]);
