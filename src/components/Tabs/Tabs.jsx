import { fetchFilter } from "../../api/http"

export default function Tabs({ setTasks, setFilter, setTabs, setError, tabs, filter }) {

	async function getTabs(newFilter) {
		try {
			const { data, info } = await fetchFilter(newFilter)
			setTasks(data)
			setTabs(info)
			setError(null)
			setFilter(newFilter)
		}
		catch (error) {
			setError(error)
		}
	}

	return (
		<section className="tabs container">
			<ul className="tabs__wrapper">
				<li className="tabs__list">
					<button className={`tabs__btn btn btn--link ${filter === "all" ? "tabs__btn--activated" : ""}`} onClick={() => getTabs("all")}>
						Всего задач: {tabs.all}
					</button>
				</li>
				<li className="tabs__list">
					<button className={`tabs__btn btn btn--link ${filter === "completed" ? "tabs__btn--activated" : ""}`} onClick={() => getTabs("completed")}>
						Выполнено: {tabs.completed}
					</button>
				</li>
				<li className="tabs__list">
					<button className={`tabs__btn btn btn--link ${filter === "inWork" ? "tabs__btn--activated" : ""}`} onClick={() => getTabs("inWork")}>
						В работе: {tabs.inWork}
					</button>
				</li>
			</ul>
		</section >
	)
}