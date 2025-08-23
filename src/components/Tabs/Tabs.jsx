import styles from "./Tabs.module.css"

export default function Tabs({ setFilter, setError, tabs, filter }) {

	async function getTabs(newFilter) {
		try {
			setError(null)
			setFilter(newFilter)
		}
		catch (error) {
			setError(error)
		}
	}

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
						onClick={() => getTabs("all")}
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
								""
							}
							`}
						onClick={() => getTabs("completed")}
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
						onClick={() => getTabs("inWork")}
					>
						В работе: {tabs.inWork}
					</button>
				</li>
			</ul>
		</section>
	)
}