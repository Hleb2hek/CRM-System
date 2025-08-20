import { useState } from 'react';

import { postUserTasks } from '../../api/http';

function AddTasks({ refreshTasks, filter, setError }) {

	const [newTask, setNewTask] = useState("");
	const [errorValidation, setErrorValidation] = useState(false)

	let inputStyles = "header__input input"
	let descriptionWarning = <p className="header__warning">Введите название, допустимая длина от 2 до 64 символов</p>

	if (newTask.length === 0) {
		inputStyles += ""
		descriptionWarning = null
	} else if (errorValidation) {
		inputStyles += " input--warning"
	}

	async function createTasks(e) {

		e.preventDefault()

		try {
			setErrorValidation(newTask.length <= 2 || newTask.length >= 64 || !newTask.trim().length);

			await postUserTasks(newTask.trim());
			await refreshTasks(filter);

			setNewTask("");
			setError(null);
		} catch (error) {
			setError(error)
		}
	}


	function getNewTask(event) {
		return setNewTask(event.target.value)
	}

	return (
		<header className="header container">
			<div className="header__body">
				<form
					className="header__form form"
				>
					<input
						value={newTask}
						onChange={getNewTask}
						className={inputStyles}
						type="text"
						placeholder='Введите название'
					/>
				</form>
				<button
					onClick={createTasks}
					className="header__btn btn"
					type="button"
					disabled={errorValidation}
				>
					Добавить
				</button>
			</div>
			{errorValidation && descriptionWarning}
		</header>
	)
}

export default AddTasks;