import { deleteTaskFetch, fetchAllTasks } from "../../api/http"

function TasksBtnDelete({ tasksId, error, setTasks, setError }) {

	async function deleteTask() {
		try {
			await deleteTaskFetch(tasksId);
			const { data } = await fetchAllTasks()

			setTasks(data)
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