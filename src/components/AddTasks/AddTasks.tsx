import styles from "./AddTasks.module.css"

import React, { useState } from 'react';

import { postUserTasks } from '../../api/http';

export const AddTasks: React.FC<{ refreshTasks: () => void }> = ({ refreshTasks }) => {

	const [newTask, setNewTask] = useState<string>("");
	const [errorValidation, setErrorValidation] = useState<string | null>(null);
	const [errorTasks, setErrorTasks] = useState<Error | null>(null);

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
		setNewTask(value);

		const errorMessage = getValidError(value);
		setErrorValidation(errorMessage);
	}

	async function createTasks(e: React.FormEvent) {

		e.preventDefault();

		const validationError = getValidError(newTask);
		if (validationError) {
			setErrorValidation(validationError);
			return;
		}

		try {

			await postUserTasks(newTask.trim());
			refreshTasks();

			setNewTask("");
			setErrorValidation(null);
			setErrorTasks(null);
		} catch (error: unknown) {
			if (error instanceof Error) setErrorTasks(error);
		}
	}

	const isFormValid = !errorValidation && newTask.trim().length > 0;

	return (
		<header className={`${styles.header} ${styles.container}`}>
			<form
				className={styles.form}
				onSubmit={createTasks}
			>
				<input
					value={newTask}
					onChange={getNewTask}
					className={`
						${styles.input}
						${errorValidation ?
							styles['input--warning'] :
							styles['input--focus']}
						`}
					type="text"
					placeholder='Введите название'
				/>
				<button
					className={styles.btn}
					type="submit"
					disabled={!isFormValid}
				>
					Добавить
				</button>
			</form>
			{errorValidation &&
				<p className={styles.edit__warning}>{errorValidation}</p>
			}
			{errorTasks && <p className={styles.error}>{errorTasks.message}</p>}
		</header>
	)
}