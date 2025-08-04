function Tasks({ error, tasks, loading }) {

	return (
		<section className="tasks container">
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
				{
					error && <p>Ошибка на сервере</p>
				}
			</ul>
		</section>
	)
}

export default Tasks