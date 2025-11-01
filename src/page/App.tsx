import { createBrowserRouter } from 'react-router';
import TodoListPage from './TodoListPage';
import Profile from './Profile';
import Root from './Root';

export const root = createBrowserRouter([
	{
		path: '/',
		element: <Root />,
		children: [
			{ index: true, element: <TodoListPage /> },
			{ path: 'profile', element: <Profile /> },
		],
	},
]);
