function Tasks({ error, tasks, loading }) {
	return (
		<section className="tasks container">

			{error && <p>{error.message}</p>}
			{loading && <p>Загрузка тасок...</p>}
			{!loading && tasks.length === 0 && !error && <p>Задач пока нет</p>}

			<ul className="tasks__wrapper">
				{
					tasks.map(({ id, title }) =>
						<li key={id} className="tasks__list">
							<form>
								<input className="tasks__checkbox" type="checkbox" id="" />
							</form>
							<p className="tasks__description">{title}</p>
							<div className="tasks__btns">
								<button className="tasks__btn btn btn--draw" type="button">Редачить</button>
								<button className="tasks__btn btn btn--delete" type="button">Удалить</button>
							</div>
						</li>
					)
				}
			</ul>
		</section>
	)
}

export default Tasks