import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import './styles/index.scss'
import TodoListPage from './page/TodoListPage.jsx'

createRoot(document.getElementById('root')).render(
	<StrictMode>
		<TodoListPage />
	</StrictMode>,
)
