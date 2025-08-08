import { editTaskFetch, fetchAllTasks } from "../../api/http";

function TasksBtnEdit({ tasksId, error, setTasks, setError }) {

	async function editTasks() {
		// Если ошибка висит, завершаем работу функции
		if (error) return;
		try {
			const createdTask = await editTaskFetch(tasksId);
			const { data } = await fetchAllTasks()

			setTasks(data)
			setError(null);
		} catch (error) {
			setError(error)
		}
	}
	return (
		<>
			<button onClick={editTasks} className="tasks__btn btn btn--draw" type="button">Редачить</button>
		</>
	)
}

export default TasksBtnEdit