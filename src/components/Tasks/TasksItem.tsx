import editSvg from '../../assets/edit.svg';
import trash from '../../assets/trash.svg';

import styles from "./Tasks.module.css"

import React, { useState } from 'react';

import { editTaskFetch, deleteTaskFetch } from "../../api/http";

export const TasksItem: React.FC<{
	id: number,
	title: string,
	isDone: boolean,
	setError: (arg: Error | null) => void;
	refreshTasks: () => void,
}> = ({
	id,
	title,
	isDone,
	refreshTasks,
	setError }) => {

		const [check, setCheck] = useState<boolean>(isDone);
		const [showEdit, setshowEdit] = useState<boolean>(false);

		const [edit, setEdit] = useState<string>(title);
		const [errorEditValidation, setErrorEditValidation] = useState<boolean>(false);

		function handleEdit() {
			setshowEdit(edit => !edit)
		}

		async function checkboxTasks() {
			const newCheck = !check;
			setCheck(newCheck);

			try {
				await editTaskFetch(id, { isDone: newCheck });
				refreshTasks();

				setError(null);
			} catch (error) {
				if (error instanceof Error) setError(error);
				setCheck(prev => !prev)
			}
		}

		async function deleteTask() {
			try {
				await deleteTaskFetch(id);
				refreshTasks();

				setError(null);
			} catch (error) {
				if (error instanceof Error) setError(error);
			}
		}

		function isValidTasks(tasks: string): boolean {
			const value = tasks.trim();
			return value.length >= 2 && value.length <= 64;
		}

		function getNewTask(event: React.ChangeEvent<HTMLInputElement>) {
			const value = event.target.value;
			setEdit(value);

			if (isValidTasks(value)) {
				setErrorEditValidation(false);
			} else {
				setErrorEditValidation(true);
			}
		}

		async function editTasks(e: React.FormEvent) {

			e.preventDefault();

			if (!isValidTasks(edit)) {
				setErrorEditValidation(true);
				return
			}

			try {

				await editTaskFetch(id, { title: edit });
				refreshTasks();

				handleEdit();
				setErrorEditValidation(false)
				setError(null);
			} catch (error) {
				if (error instanceof Error) setError(error);
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
								src={editSvg}
								width={16}
								height={16}
							/>
						</button>
						<button onClick={deleteTask} className={`${styles.tasks__btn} ${styles['tasks__btn--delete']}`} type="button">
							<img src={trash} width={16} height={16} />
						</button>
					</div>
				</li> :
				<li className={styles.edit__list}>
					<form
						className={styles.edit__form}
						onSubmit={editTasks}
					>
						<input
							value={edit}
							onChange={getNewTask}
							className={`${styles.edit__input} ${errorEditValidation ? styles['edit__input--warning'] : styles['edit__input--focus']}`}
							type="text"
						/>
						<div className={styles.edit__btns}>
							<button
								className={`${styles.edit__btn} ${styles[`edit__btn--save`]}`}
								type="submit"
								disabled={errorEditValidation}
							>
								Сохранить
							</button>
							<button
								onClick={handleEdit}
								className={`${styles.edit__btn} ${styles[`edit__btn--cancel`]}`}
								type="button">
								Отменить
							</button>
						</div>
					</form>
					{errorEditValidation && <p className={styles.edit__warning}>Введите название, допустимая длина от 2 до 64 символов</p>}
				</li>
		)
	}