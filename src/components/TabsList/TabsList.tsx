import React from 'react';

import { message, Tabs } from 'antd';

import { Filter, TodoInfo } from '../../types/todo';

interface Props {
	setFilter: (filter: Filter) => void;
	tabs: TodoInfo;
	filter: Filter;
}

const TabsList: React.FC<Props> = ({ setFilter, tabs: { all, completed, inWork }, filter }) => {
	const [messageApi, contextHolder] = message.useMessage();

	const tabItems = [
		{ key: 'all', label: `Всего задач: ${all}` },
		{ key: 'completed', label: `Выполнено: ${completed}` },
		{ key: 'inWork', label: `В работе: ${inWork}` },
	];

	const isFilter = (key: string): key is Filter => {
		return ['all', 'completed', 'inWork'].includes(key);
	};

	const errorAntd = () => {
		messageApi.open({
			type: 'error',
			content: 'This is an error message',
		});
	};

	const handleFilterChange = (key: string) => {
		if (isFilter(key)) {
			setFilter(key);
		}
	};

	return <Tabs activeKey={filter} onChange={handleFilterChange} items={tabItems} centered />;
};

export default TabsList;
