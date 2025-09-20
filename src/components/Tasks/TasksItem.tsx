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

		const [isCompleted, setIsCompleted] = useState<boolean>(isDone);
		const [showEdit, setShowEdit] = useState<boolean>(false);

		const [inputTitle, setInputTitle] = useState<string>(title);
		const [validationError, setValidationError] = useState<string | null>(null);

		function openEditMode() {
			setShowEdit(true);
			setInputTitle(title);
			setValidationError(null);
		}

		function closeEditMode() {
			setShowEdit(false);
			setInputTitle(title);
			setValidationError(null)
		}

		async function checkboxTasks() {
			setIsCompleted(!isCompleted);

			try {
				await editTaskFetch(id, { isDone: isCompleted });
				refreshTasks();

				setError(null);
			} catch (error) {
				if (error instanceof Error) setError(error);
				setIsCompleted(prev => !prev)
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

		function getValidError(tasks: string): string | null {
			const value = tasks.trim();
			const valueLength = value.length;

			if (valueLength === 0) {
				return "Название пустое, введите название";
			}
			if (valueLength < 2) {
				return `Название слишком короткое. Добавьте ${2 - valueLength} символ(ов)`;
			}
			if (valueLength > 64) {
				return `Название слишком длинное. Удалите ${valueLength - 64} символ(ов)`;
			}

			return null;
		}

		function getNewTask(event: React.ChangeEvent<HTMLInputElement>) {
			const value = event.target.value;
			setInputTitle(value);

			const errorMessage = getValidError(value);
			setValidationError(errorMessage);
		}

		async function editTasks(e: React.FormEvent) {

			e.preventDefault();

			const validationError = getValidError(inputTitle);
			if (validationError) {
				// Если есть ошибка валидации, показываем её
				setValidationError(validationError);
				return;
			}

			try {
				await editTaskFetch(id, { title: inputTitle });
				refreshTasks();
				closeEditMode();
				setError(null);
			} catch (error) {
				if (error instanceof Error) setError(error);
			}
		}

		const isFormValid = !validationError && inputTitle.trim().length > 0;

		return (
			!showEdit ?
				<li className={styles.tasks__list}>
					<input
						onChange={checkboxTasks}
						checked={isCompleted}
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
							onClick={openEditMode}
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
							value={inputTitle}
							onChange={getNewTask}
							className={`${styles.edit__input} ${validationError ? styles['edit__input--warning'] : styles['edit__input--focus']}`}
							type="text"
						/>
						<div className={styles.edit__btns}>
							<button
								className={`${styles.edit__btn} ${styles[`edit__btn--save`]}`}
								type="submit"
								disabled={!isFormValid}
							>
								Сохранить
							</button>
							<button
								onClick={closeEditMode}
								className={`${styles.edit__btn} ${styles[`edit__btn--cancel`]}`}
								type="button">
								Отменить
							</button>
						</div>
					</form>
					{validationError &&
						<p className={styles.edit__warning}>{validationError}</p>
					}
				</li>
		)
	}