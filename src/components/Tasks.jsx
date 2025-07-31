import { useState, useEffect } from 'react';

import { fetchAllTasks } from "../api/http";

function Tasks() {

	const [sss, setSss] = useState([])

	useEffect(() => {
		async function arrss() {
			const arr = await fetchAllTasks()
			setSss(arr)
		}
		arrss()
	}, []);
	console.log(sss);

	return (
		<section className="tasks container">
			<ul className="tasks__wrapper">
				{
					// sss.data.map(arr =>
					// 	<li className="tasks__list">
					// 		{arr}
					// 	</li>)
				}
			</ul>
		</section>
	)
}

export default Tasks