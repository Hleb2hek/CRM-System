import styles from "./AddTasks.module.css"

import React, { useState } from 'react';

import { postUserTasks } from '../../api/http';

export const AddTasks: React.FC<{ refreshTasks: () => void }> = ({ refreshTasks }) => {

	const [newTask, setNewTask] = useState<string>("");
	const [errorValidation, setErrorValidation] = useState<boolean>(false);
	const [errorTasks, setErrorTasks] = useState<Error | null>(null);

	function isValidTasks(tasks: string): boolean {
		const value = tasks.trim();
		return value.length >= 2 && value.length <= 64;
	}

	function getNewTask(event: React.ChangeEvent<HTMLInputElement>) {
		const value = event.target.value;
		setNewTask(value);

		if (isValidTasks(value)) {
			setErrorValidation(false);
		} else {
			setErrorValidation(true);
		}
	}

	async function createTasks(e: React.FormEvent) {

		e.preventDefault();

		if (!isValidTasks(newTask)) {
			setErrorValidation(true);
			return;
		}

		try {

			await postUserTasks(newTask.trim());
			refreshTasks();

			setNewTask("");
			setErrorValidation(false);
			setErrorTasks(null);
		} catch (error: unknown) {
			if (error instanceof Error) setErrorTasks(error);
		}
	}

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
					disabled={errorValidation}
				>
					Добавить
				</button>
			</form>
			{errorValidation && <p className={styles.warning}>Введите название, допустимая длина от 2 до 64 символов</p>}
			{errorTasks && <p className={styles.error}>{errorTasks.message}</p>}
		</header>
	)
}