function Tasks({ tasks, loading }) {

	return (
		<section className="tasks container">
			<ul className="tasks__wrapper">
				{
					loading ?
						(<p>Загрузка данных</p>) :
						(tasks.map(({ id, title }) =>
							<li key={id} className="tasks__list">
								<p>{title}</p>
							</li>)
						)
				}
			</ul>
		</section>
	)
}

export default Tasks