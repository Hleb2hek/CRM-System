import edit from '../../assets/edit.svg';
import styles from "./Tasks.module.css"

import { useState } from 'react';
import { editTaskFetch } from "../../api/http";

import TasksEdit from "./TasksEdit";
import TasksBtnDelete from './TasksBtnDelete';

export default function TasksItem({ id, title, isDone, refreshTasks, filter, setError }) {

	const [check, setCheck] = useState(isDone);
	const [showEdit, setshowEdit] = useState(false);

	function handleEdit() {
		setshowEdit(edit => !edit)
	}

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
		!showEdit ?
			<li className={styles.tasks__list}>
				<input
					onChange={checkboxTasks}
					checked={check}
					className={`
							${styles.tasks__checkbox}
							${styles.tasks__input}
							${styles[`tasks__input--checkbox`]}
						`}
					type="checkbox"
				/>
				<p className={
					isDone
						? `${styles.tasks__description} ${styles['tasks__description--checked']}`
						: styles.tasks__description
				}>
					{title}
				</p>
				<div className={styles.tasks__btns}>
					<button
						onClick={handleEdit}
						className={styles.tasks__btn}
						type="button"
					>
						<img
							src={edit}
							width={16}
							height={16}
						/>
					</button>
					<TasksBtnDelete
						tasksId={id}
						refreshTasks={refreshTasks}
						setError={setError}
					/>
				</div>
			</li> :
			<TasksEdit
				refreshTasks={refreshTasks}
				id={id}
				title={title}
				setError={setError}
				handleEdit={handleEdit}
			/>
	)
}