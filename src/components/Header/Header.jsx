import { submitHandler } from './header-functions';

import { postUserTasks } from '../../api/http';

function Header({ refreshTasks, filter, setError, setTasks, newTask, setNewTask }) {

	// Проверка на длину значения и на пробелы вначале
	const getBtnTrue = newTask.length <= 2 || newTask.length >= 64 || !newTask.trim().length;

	let inputStyles = "header__input input"
	let descriptionWarning = <p className="header__warning">Введите название, допустимая длина от 2 до 64 символов</p>

	async function createTasks() {
		try {
			const createdTask = await postUserTasks(newTask.trim());
			setTasks(t => [...t, createdTask]);
			await refreshTasks(filter)
			setNewTask("")
			setError(null);
		} catch (error) {
			setError(error)
		}
	}

	if (newTask.length === 0) {
		inputStyles += ""
		descriptionWarning = null
	} else if (getBtnTrue) {
		inputStyles += " input--warning"
	}

	function getNewTask(event) {
		return setNewTask(event.target.value)
	}

	return (
		<header className="header container">
			<div className="header__body">
				<form
					onSubmit={submitHandler}
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
					onClick={() => createTasks()}
					className="header__btn btn"
					type="button"
					disabled={getBtnTrue}
				>
					Добавить
				</button>
			</div>
			{getBtnTrue && descriptionWarning}
		</header>
	)
}

export default Header;