import TasksBtnDelete from "./TasksBtnDelete"
import TasksBtnEdit from "./TasksBtnEdit"
import TasksCheckbox from "./TasksCheckbox"

function Tasks({ refreshTasks, filter, error, setError, tasks, setTasks, loading }) {

	return (
		<section className="tasks container">
			{error && <p>{error.message}</p>}
			{loading && <p className="tasks__loading">Загрузка тасок...</p>}
			{!loading && tasks.length === 0 && !error && <p className="tasks__nothing">Задач пока нет</p>}

			<ul className="tasks__wrapper">
				{
					tasks.map(({ id, title, isDone }) => {
						const description = isDone
							? "tasks__description tasks__description--checked"
							: "tasks__description";


						return (

							<li key={id} className="tasks__list">

								<TasksCheckbox
									tasksId={id}
									isDone={isDone}
									filter={filter}

									refreshTasks={refreshTasks}

									setError={setError}
								/>
								<p className={description}>
									{title}
								</p>
								<div className="tasks__btns">
									<TasksBtnEdit
										tasksId={id}
										tasksTitle={title}

										setTasks={setTasks}
										setError={setError}
									/>
									<TasksBtnDelete
										tasksId={id}
										filter={filter}

										refreshTasks={refreshTasks}

										setError={setError}
									/>
								</div>
							</li>
						)
					}
					)
				}
			</ul>
		</section>
	)
}

export default Tasks