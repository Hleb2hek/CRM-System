import Header from "./components/Header"

import { fetchAllTasks } from "./api/http"

const data = await fetchAllTasks()
console.log(data.data);
function App() {

	return (
		<>
			<Header />
		</>
	)

}

export default App
