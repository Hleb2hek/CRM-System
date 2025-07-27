import { useState, useEffect } from 'react'

import { postUserTasks } from '../api/http';

function Header() {

	const [data, setData] = useState('string');

	async function getTasks() {
		setData((data) => {
			postUserTasks(data)
		})
	}


	return (
		<header className="header">
			<div className="header__body container">
				<form className="header__form form">
					<input className="form__input" type="text" />
				</form>
				<button onClick={() => getTasks(data)} className="header__btn btn" type="button">
					Add
				</button>
			</div>
		</header>
	)
}

export default Header;