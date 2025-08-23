import trash from '../../assets/trash.svg';

import styles from "./Tasks.module.css"
import btn from "../../styles/components/btn.module.css"

import { deleteTaskFetch } from "../../api/http";

export default function TasksBtnDelete({ refreshTasks, tasksId, setError }) {

	async function deleteTask() {
		try {
			await deleteTaskFetch(tasksId);
			await refreshTasks();

			setError(null);
		} catch (error) {
			setError(error);
		}
	}

	return (
		<button onClick={deleteTask} className={`${styles.tasks__btn} ${btn.btn} ${btn['btn--delete']}`} type="button">
			<img src={trash} width={16} height={16} />
		</button>
	)
}