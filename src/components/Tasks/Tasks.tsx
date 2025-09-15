import React from "react"
import styles from "./Tasks.module.css"

import { TasksItem } from "./TasksItem"
import { Filter, Todo } from "../../models/todo";

export const Tasks: React.FC<{
	filter: Filter;
	tasks: Todo[];
	refreshTasks: () => void;
	setError: (arg: Error | null) => void;
}> = ({ tasks, refreshTasks, setError }) => {
	return (
		<section className={`${styles.tasks} ${styles.container}`}>
			<ul className={styles.tasks__wrapper}>
				{
					tasks.map(({ id, title, isDone }) => {
						return (
							<TasksItem
								key={id}
								id={id}
								title={title}
								isDone={isDone}

								refreshTasks={refreshTasks}
								setError={setError}
							/>
						)
					}
					)
				}
			</ul>
		</section>
	)
}