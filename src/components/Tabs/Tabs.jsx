import styles from "./Tabs.module.css"

export default function Tabs({ setFilter, tabs, filter }) {
	return (
		<section className={`
			${styles.tabs}
			${styles.container}
		`}
		>
			<ul className={styles.tabs__wrapper}>
				<li>
					<button
						className={`
							${styles.tabs__btn}
							${filter === "all" ?
								styles["tabs__btn--activated"]
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
								${styles.tabs__btn}
								${filter === "completed" ?
								styles["tabs__btn--activated"] :
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
							${styles.tabs__btn}
							${filter === "inWork" ?
								styles["tabs__btn--activated"] :
								""
							}
						`}
						onClick={() => setFilter("inWork")}
					>
						В работе: {tabs.inWork}
					</button>
				</li>
			</ul>
		</section>
	)
}