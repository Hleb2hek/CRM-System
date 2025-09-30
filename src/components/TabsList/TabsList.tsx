import React from "react"

import { Tabs } from "antd";

import { Filter, TodoInfo } from "../../models/todo";

export const TabsList: React.FC<{
	setFilter: (filter: Filter) => void;
	tabs: TodoInfo;
	filter: Filter
}> = ({ setFilter, tabs: {all,completed,inWork}, filter }) => {
	const tabItems = [
			{key: 'all', label: `Всего задач: ${all}`},
			{key: 'completed', label: `Выполнено: ${completed}`},
			{key: 'inWork', label: `В работе: ${inWork}`}
	];
	
	return (

		<Tabs
			activeKey={filter}
			onChange={(key) => setFilter(key as Filter)}
			items={tabItems}
			centered
		/>
	)
}