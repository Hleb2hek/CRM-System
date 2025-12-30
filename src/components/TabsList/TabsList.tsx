import React from 'react';

import { Tabs } from 'antd';

import { Filter, TodoInfo } from '../../types/todo';

interface Props {
	setFilter: (filter: Filter) => void;
	tabs: TodoInfo;
	filter: Filter;
}

const TabsList: React.FC<Props> = ({ setFilter, tabs: { all, completed, inWork }, filter }) => {
	const tabItems = [
		{ key: 'all', label: `Всего задач: ${all}` },
		{ key: 'completed', label: `Выполнено: ${completed}` },
		{ key: 'inWork', label: `В работе: ${inWork}` },
	];

	const isFilter = (key: string): key is Filter => {
		return ['all', 'completed', 'inWork'].includes(key);
	};

	const handlFilterChange = (key: string) => {
		if (isFilter(key)) {
			setFilter(key);
		}
	};

	return <Tabs activeKey={filter} onChange={handlFilterChange} items={tabItems} centered />;
};

export default TabsList;
