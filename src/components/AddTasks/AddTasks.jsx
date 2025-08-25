import styles from "./AddTasks.module.css"

import { useState } from 'react';

import { postUserTasks } from '../../api/http';

export default function AddTasks({ refreshTasks }) {

	const [newTask, setNewTask] = useState("");
	const [errorValidation, setErrorValidation] = useState(false);
	const [errorTasks, setErrorTasks] = useState(null);

	function isValidTasks(tasks) {
		const value = tasks.trim();
		return value.length >= 2 && value.length <= 64;
	}

	function getNewTask(event) {
		const value = event.target.value;
		setNewTask(value);

		if (isValidTasks(value)) {
			setErrorValidation(false);
		} else {
			setErrorValidation(true);
		}
	}

	async function createTasks(e) {

		e.preventDefault();

		if (!isValidTasks(newTask)) {
			setErrorValidation(true);
			return;
		}

		try {

			await postUserTasks(newTask.trim());
			await refreshTasks();

			setNewTask("");
			setErrorValidation(false);
			setErrorTasks(null);
		} catch (error) {
			setErrorTasks(error)
		}
	}

	return (
		<header className={`${styles.header} ${styles.container}`}>
			<form
				className={styles.header__form}
				onSubmit={createTasks}
			>
				<input
					value={newTask}
					onChange={getNewTask}
					className={`
						${styles.header__input}
						${errorValidation ?
							styles['header__input--warning'] :
							styles['header__input--focus']}
						`}
					type="text"
					placeholder='Введите название'
				/>
				<button
					className={`${styles.header__btn}`}
					type="submit"
					disabled={errorValidation}
				>
					Добавить
				</button>
			</form>
			{errorValidation && <p className={styles.header__warning}>Введите название, допустимая длина от 2 до 64 символов</p>}
			{errorTasks && <p className={styles.header__error}>{errorTasks.message}</p>}
		</header>
	)
}