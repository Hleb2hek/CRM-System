import { useState } from "react";

import TasksModal from "./TasksModal";

function TasksBtnEdit({ tasksId, tasksTitle, setTasks, setError }) {

	const [state, setState] = useState(false);

	return (
		<>
			<button onClick={() => setState(!state)} className="tasks__btn btn btn--draw" type="button">Редачить</button>
			{state &&
				<TasksModal
					tasksId={tasksId}
					tasksTitle={tasksTitle}

					setTasks={setTasks}
					setError={setError}

					state={state}
					setState={setState}
				/>}
		</>
	)
}

export default TasksBtnEdit