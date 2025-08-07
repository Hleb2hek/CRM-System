import { deleteTaskFetch, fetchAllTasks } from "../../api/http"

function TasksBtnDelete({ tasksId, setTasks }) {

	async function deleteTask() {
		try {
			await deleteTaskFetch(tasksId);
			const { data } = await fetchAllTasks()

			setTasks(data)
		} catch (error) {
			console.error(error);
		}
	}

	return (
		<button onClick={deleteTask} className="tasks__btn btn btn--delete" type="button">Удалить</button>
	)
}

export default TasksBtnDelete;