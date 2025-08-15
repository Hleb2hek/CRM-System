import { deleteTaskFetch, fetchAllTasks } from "../../api/http"

function TasksBtnDelete({ refreshTasks, filter, tasksId, setError }) {

	async function deleteTask() {
		try {
			await deleteTaskFetch(tasksId);
			await refreshTasks(filter)

			setError(null);
		} catch (error) {
			setError(error);
		}
	}

	return (
		<button onClick={deleteTask} className="tasks__btn btn btn--delete" type="button">Удалить</button>
	)
}

export default TasksBtnDelete;