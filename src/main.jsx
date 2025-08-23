import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import './styles/base/reset.css'
import './styles/base/variables.css';
import './styles/base/globals.css';

import TodoListPage from './page/TodoListPage.jsx'

createRoot(document.getElementById('root')).render(
	<StrictMode>
		<TodoListPage />
	</StrictMode>,
)
