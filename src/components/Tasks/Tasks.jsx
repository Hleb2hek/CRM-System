import TasksBtnDelete from "./TasksBtnDelete"
import TasksBtnEdit from "./TasksBtnEdit"
import TasksCheckbox from "./TasksCheckbox"

function Tasks({ error, setError, tasks, setTasks, loading }) {
	return (
		<section className="tasks container">

			{error && <p>{error.message}</p>}
			{loading && <p>Загрузка тасок...</p>}
			{!loading && tasks.length === 0 && !error && <p>Задач пока нет</p>}

			<ul className="tasks__wrapper">
				{
					tasks.map(({ id, title }) =>
						<li key={id} className="tasks__list">
							<TasksCheckbox />
							<p className="tasks__description">{title}</p>
							<div className="tasks__btns">
								<TasksBtnEdit tasksId={id} setTasks={setTasks} error={error} setError={setError} />
								<TasksBtnDelete tasksId={id} setTasks={setTasks} error={error} setError={setError} />
							</div>
						</li>
					)
				}
			</ul>
		</section>
	)
}

export default Tasks