function Header({error, setNewTask, createTasks }) {

	return (
		<header className="header container">
			<div className="header__body">
				<form className="header__form form">
					<input onChange={event => setNewTask(event.target.value)} className="header__input input" type="text" />
				</form>
				<button onClick={() => createTasks()} className="header__btn btn" type="button">
					Добавить
				</button>
			</div>
		</header>
	)
}

export default Header;