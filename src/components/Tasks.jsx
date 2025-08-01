import { useState, useEffect } from 'react';

import { fetchAllTasks } from "../api/http";

function Tasks() {
	const [task, setTask] = useState([]);
	const [loading, setLoading] = useState(true);


	useEffect(() => {
		try {
			async function getTasks() {
				const fetchTask = await fetchAllTasks()
				setTask(fetchTask.data)
				setLoading(false)
			}
			let timeTask = setInterval(() => {
				getTasks()
			},1000)

			return () => {
				clearInterval(timeTask)
			}
		} catch {

		}
	}, []);

	return (
		<section className="tasks container">
			<ul className="tasks__wrapper">
				{
					loading ? (<p>Загрузка данных</p>) : (task.map(({id,title,isDone}) =>
						<li key={id} className="tasks__list">
							<p>{title}</p>
						</li>))
				}
			</ul>
		</section>
	)
}

export default Tasks