import React from 'react';

import { Tabs } from 'antd';

import { TabListProps } from '../../types/todo';
import { isFilter } from '../../utils/filters';

const TABS_TEXT = {
	TOTAL: 'Всего задач',
	COMPLETED: 'Выполнено',
	IN_PROGRESS: 'В работе',
};

const TabsList: React.FC<TabListProps> = ({
	setFilter,
	tabs: { all, completed, inWork },
	filter,
}) => {
	const tabItems = [
		{ key: 'all', label: `${TABS_TEXT.TOTAL}: ${all}` },
		{ key: 'completed', label: `${TABS_TEXT.COMPLETED}: ${completed}` },
		{ key: 'inWork', label: `${TABS_TEXT.IN_PROGRESS}: ${inWork}` },
	];

	const handleFilterChange = (key: string) => {
		if (isFilter(key)) {
			setFilter(key);
		}
	};

	return <Tabs activeKey={filter} onChange={handleFilterChange} items={tabItems} centered />;
};

export default TabsList;
