import { Flex, Typography, Button } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { closeModal } from './statusSlice';
import { Link } from 'react-router-dom';

export default function StatusModal() {
	const dispatch = useDispatch();
	const { showModal, message, type } = useSelector((state: RootState) => state.status);

	if (!showModal) return null;

	return (
		<Flex
			style={{
				position: 'fixed',
				inset: 0,
				justifyContent: 'center',
				alignItems: 'center',
				backgroundColor: 'rgba(0,0,0,0.5)',
			}}>
			<Flex
				style={{
					flexDirection: 'column',
					gap: '2rem',
					padding: '2rem',
					backgroundColor: 'white',
					borderRadius: '1rem',
				}}>
				<Typography.Title level={2}>{message}</Typography.Title>

				{type === 'success' ? (
					<Flex gap={16}>
						<Button type="primary" onClick={() => dispatch(closeModal())}>
							Закрыть
						</Button>

						<Link to="/">
							<Button type="default" onClick={() => dispatch(closeModal())}>
								Перейти
							</Button>
						</Link>
					</Flex>
				) : (
					<Flex gap={16}>
						<Button type="primary" onClick={() => dispatch(closeModal())}>
							Закрыть
						</Button>
					</Flex>
				)}
			</Flex>
		</Flex>
	);
}
