import { useState } from "react";

import { editTaskFetch } from "../../api/http"

export default function TasksModal({ refreshTasks, tasksId, tasksTitle, setTasks, setError, state, setState }) {

	const [edit, setEdit] = useState(tasksTitle);

	async function editTasks() {
		try {
			await editTaskFetch(tasksId, edit);
			await refreshTasks()
			setError(null);
			setState(false)
		} catch (error) {
			setError(error)
		}
	}

	const getBtnTrue = edit.length <= 2 || edit.length >= 64;

	let inputStyles = "modal__input input"
	let descriptionWarning = <p className="modal__warning">Введите название, допустимая длина от 2 до 64 символов</p>

	if (edit.length === 0) {
		inputStyles += ""
		descriptionWarning = null
	} else if (getBtnTrue) {
		inputStyles += " input--warning"
	}

	function getNewTask(event) {
		return setEdit(event.target.value)
	}

	return (
		<div className="tasks__modal modal">
			<div className="modal__wrapper">

				<input
					value={edit}
					onChange={getNewTask}
					className={inputStyles}
					type="text"
				/>

				{getBtnTrue && descriptionWarning}

				<div className="modal__btns">
					<button
						onClick={() => editTasks()}
						className="modal__btn btn btn--save"
						type="button"
						disabled={getBtnTrue}
					>
						Сохранить
					</button>
					<button
						onClick={() => setState(!state)}
						className="modal__btn btn btn--cancel"
						type="button">
						Отменить
					</button>
				</div>
			</div>
		</div>
	)
}