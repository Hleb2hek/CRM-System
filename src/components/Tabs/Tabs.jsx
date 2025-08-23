import { container } from "../../styles/components/containers.module.css"
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
		<section className={`${styles.tabs} ${container}`}>
			<ul className={styles.tabs__wrapper}>
				<li className={styles.tabs__list}>
					<button className={`${styles.tabs__btn} ${filter === "all" ? styles["tabs__btn--activated"] : ""}`} onClick={() => getTabs("all")}>
						Всего задач: {tabs.all}
					</button>
				</li>
				<li className="tabs__list">
					<button className={`${styles.tabs__btn} ${filter === "completed" ? styles["tabs__btn--activated"] : ""}`} onClick={() => getTabs("completed")}>
						Выполнено: {tabs.completed}
					</button>
				</li>
				<li className="tabs__list">
					<button className={`${styles.tabs__btn} ${filter === "inWork" ? styles["tabs__btn--activated"] : ""}`} onClick={() => getTabs("inWork")}>
						В работе: {tabs.inWork}
					</button>
				</li>
			</ul>
		</section >
	)
}