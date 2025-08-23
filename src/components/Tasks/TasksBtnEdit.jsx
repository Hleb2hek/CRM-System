import edit from '../../assets/edit.svg';

import styles from "./Tasks.module.css"
import btn from "../../styles/components/btn.module.css"

import { useState } from "react";

import TasksBtnEditModal from "./TasksBtnEditModal";

export default function TasksBtnEdit({ refreshTasks, id, tasksTitle, setError }) {

	const [showModal, setShowModal] = useState(false);

	function handleModal() {
		setShowModal(modal => !modal)
	}

	return (
		<>
			<button onClick={handleModal} className={`${styles.tasks__btn} ${btn.btn} ${btn['btn--draw']}`} type="button">
				<img src={edit} width={16} height={16} alt="" />
			</button>
			{showModal &&

				<TasksBtnEditModal

					id={id}
					tasksTitle={tasksTitle}

					refreshTasks={refreshTasks}

					setError={setError}
					showModal={showModal}
					handleModal={handleModal}
				/>
			}
		</>
	)
}