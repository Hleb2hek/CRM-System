import edit from '../../assets/edit.svg'

import { useState } from "react";

import TasksBtnEditModal from "./TasksBtnEditModal";

function TasksBtnEdit({ refreshTasks, tasksId, tasksTitle, setTasks, setError }) {

	const [state, setState] = useState(false);

	return (
		<>
			<button onClick={() => setState(!state)} className="tasks__btn btn btn--draw" type="button">
				<img src={edit} width={20} height={20} alt="" />
			</button>
			{state &&
				<TasksBtnEditModal
					tasksId={tasksId}
					tasksTitle={tasksTitle}

					refreshTasks={refreshTasks}

					setTasks={setTasks}
					setError={setError}

					state={state}
					setState={setState}
				/>}
		</>
	)
}

export default TasksBtnEdit