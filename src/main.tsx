import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import TodoListPage from './page/TodoListPage';

createRoot(document.getElementById('root') as HTMLElement).render(
	<StrictMode>
		<TodoListPage />
	</StrictMode>,
);
