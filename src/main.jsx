import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import './styles/reset.css'
import './styles/variables.css';
import './styles/globals.css';

import TodoListPage from './page/TodoListPage.jsx'

createRoot(document.getElementById('root')).render(
	<StrictMode>
		<TodoListPage />
	</StrictMode>,
)
