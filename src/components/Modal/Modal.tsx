import { Flex, Typography } from 'antd';
import { Link } from 'react-router';

export default function Modal() {
	return (
		<Flex
			style={{
				position: 'fixed',
				inset: 0,
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
				pointerEvents: 'all',
				backgroundColor: 'green',
			}}>
			<Flex
				style={{
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
					flexDirection: 'column',
					gap: '4rem',
					padding: '0rem 2rem',
					backgroundColor: 'white',
					height: '12rem',
					borderRadius: '1rem',
				}}>
				<Typography.Title level={2} style={{ margin: 0 }}>
					Успешно авторизовался
				</Typography.Title>
				<Link
					style={{
						display: 'inline-block',
						padding: '0.5rem 1rem',
						border: ' solid #3178dbff 2px',
						color: '#3178dbff',
						borderRadius: '0.5rem',
						textDecoration: 'none',
						textAlign: 'center',
					}}
					to="../todo">
					Проходи
				</Link>
			</Flex>
		</Flex>
	);
}
