import { useState } from "react";

import { editTaskFetch } from "../../api/http"

function TasksCheckbox({ refreshTasks, filter, tasksId, isDone, setError }) {
	const [check, setCheck] = useState(isDone);

	async function checkboxTasks() {
		const newCheck = !check;
		setCheck(newCheck);

		try {
			await editTaskFetch(tasksId, null, newCheck);
			await refreshTasks(filter)

			setError(null);
		} catch (error) {
			setError(error)
			setCheck(prev => !prev)
		}
	}

	return (
		<input onChange={checkboxTasks} checked={check} className="tasks__checkbox input input--checkbox" type="checkbox" />
	)
}

export default TasksCheckbox;
