import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import './styles/reset.css'
import './styles/variables.css';
import './styles/globals.css';

import TodoListPage from './page/TodoListPage'

createRoot(document.getElementById('root') as HTMLElement).render(
	<StrictMode>
		<TodoListPage />
	</StrictMode>,
)
