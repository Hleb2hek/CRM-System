import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { createBrowserRouter, RouterProvider } from 'react-router';
import TodoListPage from './page/TodoListPage';
import Profile from './page/Profile';
import Root from './page/Root';

const root = createBrowserRouter([
	{
		path: '/',
		element: <Root />,
		children: [
			{ index: true, element: <TodoListPage /> },
			{ path: 'profile', element: <Profile /> },
		],
	},
]);
createRoot(document.getElementById('root') as HTMLElement).render(
	<StrictMode>
		<RouterProvider router={root} />
	</StrictMode>,
);
