import styles from "./Tasks.module.css"
import input from "../../styles/components/input.module.css";

import { useState } from 'react';

import { editTaskFetch } from "../../api/http";

import TasksBtnEdit from "./TasksBtnEdit";
import TasksBtnDelete from './TasksBtnDelete';

export default function TasksItem({ id, title, isDone, refreshTasks, filter, setError }) {

	const [check, setCheck] = useState(isDone);

	const description = isDone
		? "tasks__description tasks__description--checked"
		: "tasks__description";

	async function checkboxTasks() {
		const newCheck = !check;
		setCheck(newCheck);

		try {
			await editTaskFetch(id, null, newCheck);
			await refreshTasks(filter);

			setError(null);
		} catch (error) {
			setError(error);
			setCheck(prev => !prev)
		}
	}

	return (
		<li className={styles.tasks__list}>

			<input
				onChange={checkboxTasks}
				checked={check}
				className={`${styles.tasks__checkbox} ${input.input} ${input[`input--checkbox`]}`}
				type="checkbox"
			/>
			<p className={`${isDone} ? ${styles.tasks__description} ${styles['tasks__description--checked']} : ${styles.tasks__description}}`}>
				{title}
			</p>
			<div className={styles.tasks__btns}>
				<TasksBtnEdit
					id={id}
					tasksTitle={title}

					refreshTasks={refreshTasks}
					setError={setError}
				/>
				<TasksBtnDelete
					tasksId={id}
					refreshTasks={refreshTasks}
					setError={setError}
				/>
			</div>
		</li>
	)
}