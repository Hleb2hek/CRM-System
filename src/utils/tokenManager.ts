const createTokenManager = () => {
	let accessToken: string = '';

	const getAccessToken = () => {
		return accessToken;
	};
	const getRefreshToken = () => {
		return localStorage.getItem('refreshToken');
	};
	const setAccessToken = (token: string) => {
		accessToken = token;
	};
	const setRefreshToken = (token: string) => {
		localStorage.setItem('refreshToken', token);
	};
	const clearAccessToken = () => {
		accessToken = '';
		localStorage.removeItem('refreshToken');
	};
	return {
		getAccessToken,
		getRefreshToken,

		setAccessToken,
		setRefreshToken,

		clearAccessToken,
	};
};

const tokenManager = createTokenManager();
export default tokenManager;
