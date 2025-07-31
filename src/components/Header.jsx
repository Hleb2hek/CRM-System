import { useState } from 'react'

import { postUserTasks } from '../api/http';

function Header() {

	const [tasks, setTasks] = useState([]);
	const [newTask, setNewTask] = useState("");

	async function getTasks() {
		const createdTask = await postUserTasks(newTask);
		setTasks(t => [createdTask, ...t]);
	}

	return (
		<header className="header container">
			<div className="header__body">
				<form className="header__form form">
					<input onChange={event => setNewTask(event.target.value)} className="header__input input" type="text" />
				</form>
				<button onClick={() => getTasks()} className="header__btn btn" type="button">
					Добавить
				</button>
			</div>
		</header>
	)
}

export default Header;