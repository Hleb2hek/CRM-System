import React from "react"

import styles from "./Tabs.module.css";

import { Filter, TodoInfo } from "../../models/todo";


export const TabsList: React.FC<{
	setFilter: (filter: Filter) => void;
	tabs: TodoInfo;
	filter: Filter
}> = ({ setFilter, tabs, filter }) => {

	console.log(filter);
	return (

		<div>
			<ul>
				<li>
					<button
						className={`
							${styles.btn}
							${filter === "all" ?
								styles["btn--activated"]
								: ""
							}
						`}
						onClick={() => setFilter("all")}
					>
						Всего задач: {tabs.all}
					</button>
				</li>
				<li>
					<button
						className={`
								${styles.btn}
								${filter === "completed" ?
								styles["btn--activated"] :
								""}
							`}
						onClick={() => setFilter("completed")}
					>
						Выполнено: {tabs.completed}
					</button>
				</li>
				<li>
					<button
						className={`
							${styles.btn}
							${filter === "inWork" ?
								styles["btn--activated"] :
								""
							}
						`}
						onClick={() => setFilter("inWork")}
					>
						В работе: {tabs.inWork}
					</button>
				</li>
			</ul>
		</div>
	)
}