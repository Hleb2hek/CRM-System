import styles from "./TasksEdit.module.css"

import { useState } from "react";

import { editTaskFetch } from "../../api/http"

export default function TasksEdit({ refreshTasks, id, title, setError, handleEdit }) {

	const [edit, setEdit] = useState(title);
	const [errorEditValidation, setErrorEditValidation] = useState(false);

	function isValidTasks(tasks) {
		const value = tasks.trim();
		return value.length >= 2 && value.length <= 64;
	}
	function getNewTask(event) {
		const value = event.target.value;
		setEdit(value);

		if (isValidTasks(value)) {
			setErrorEditValidation(false);
		} else {
			setErrorEditValidation(true);
		}
	}

	async function editTasks(e) {

		e.preventDefault();

		if (!isValidTasks(edit)) {
			setErrorEditValidation(true);
			return
		}

		try {

			await editTaskFetch(id, edit);
			await refreshTasks();

			handleEdit();
			setErrorEditValidation(false)
			setError(null);
		} catch (error) {
			setError(error);
		}
	}

	return (
		<li className={styles.edit__list}>
			<form
				className={styles.edit__form}
				onSubmit={editTasks}
			>
				<input
					value={edit}
					onChange={getNewTask}
					className={`${styles.edit__input} ${errorEditValidation ? styles['edit__input--warning'] : styles['edit__input--focus']}`}
					type="text"
				/>
				<div className={styles.edit__btns}>
					<button
						className={`${styles.edit__btn} ${styles[`edit__btn--save`]}`}
						type="submit"
						disabled={errorEditValidation}
					>
						Сохранить
					</button>
					<button
						onClick={handleEdit}
						className={`${styles.edit__btn} ${styles[`edit__btn--cancel`]}`}
						type="button">
						Отменить
					</button>
				</div>
			</form>
			{errorEditValidation && <p className={styles.edit__warning}>Введите название, допустимая длина от 2 до 64 символов</p>}
		</li>
	)
}