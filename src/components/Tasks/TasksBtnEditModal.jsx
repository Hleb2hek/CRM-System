import input from "../../styles/components/input.module.css"
import btn from "../../styles/components/btn.module.css"
import tasksStyles from "./Tasks.module.css"
import styles from "./TasksBtnEditModal.module.css"

import { useState } from "react";

import { editTaskFetch } from "../../api/http"

export default function TasksModal({ refreshTasks, id, tasksTitle, setError, handleModal }) {

	const [edit, setEdit] = useState(tasksTitle);
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

			handleModal();
			setErrorEditValidation(false)
			setError(null);
		} catch (error) {
			setError(error);
		}
	}

	return (
		<div className={`${tasksStyles.tasks__modal} ${styles.modal}`}>
			<form
				className={styles.modal__form}
				onSubmit={editTasks}
			>
				<input
					value={edit}
					onChange={getNewTask}
					className={`${styles.modal__input} ${input.input} ${errorEditValidation ? input['input--warning'] : ''}`}
					type="text"
				/>
				{errorEditValidation && <p className={styles.modal__warning}>Введите название, допустимая длина от 2 до 64 символов</p>}
				<div className={styles.modal__btns}>
					<button
						className={`${styles.modal__btn} ${btn.btn} ${btn[`btn--save`]}`}
						type="submit"
						disabled={errorEditValidation}
					>
						Сохранить
					</button>
					<button
						onClick={handleModal}
						className={`${styles.modal__btn} ${btn.btn} ${btn[`btn--cancel`]}`}
						type="button">
						Отменить
					</button>
				</div>

			</form>
		</div>
	)
}