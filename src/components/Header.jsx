import '../styles/components/Header.scss';

function Header() {
	return (
		<header className="header">
			<div className="header__body container">
				<form className="header__form form">
					<input className="form__input" type="text" />
				</form>
				<button className="header__btn btn" type="button">
					Add
				</button>
			</div>
		</header>
	)
}

export default Header;