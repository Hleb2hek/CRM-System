import { Layout, Menu } from 'antd';
import { TeamOutlined, UserOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Sider } = Layout;

const Navigation = () => {
	let navigate = useNavigate();
	return (
		<Sider trigger={null} collapsible>
			<Menu
				mode="inline"
				theme="light"
				defaultSelectedKeys={['1']}
				style={{ height: '100%', borderRight: 0 }}
				items={[
					{
						key: '1',
						icon: <UserOutlined />,
						label: 'Список задач',
						onClick: () => {
							navigate('/');
						},
					},
					{
						key: '2',
						icon: <TeamOutlined />,
						label: 'Профиль',
						onClick: () => {
							navigate('/profile');
						},
					},
				]}
			/>
		</Sider>
	);
};

export default Navigation;
