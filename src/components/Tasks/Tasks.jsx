import { container } from "../../styles/components/containers.module.css"
import styles from "./Tasks.module.css"

import TasksItem from "./TasksItem"

export default function Tasks({ refreshTasks, filter, setError, tasks }) {


	return (
		<section className={`${styles.tasks} ${container}`}>
			<ul className={styles.tasks__wrapper}>
				{
					tasks.map(({ id, title, isDone }) => {
						return (
							<TasksItem key={id} id={id} title={title} isDone={isDone} refreshTasks={refreshTasks} filter={filter} setError={setError} />
						)
					}
					)
				}
			</ul>
		</section>
	)
}