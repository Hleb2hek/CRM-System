const createAuthTokenStore = () => {
	let accessToken: string = '';

	const getAccessToken = () => {
		return accessToken;
	};
	const setAccessToken = (token: string) => {
		accessToken = token;
	};
	const clearAccessToken = () => {
		accessToken = '';
	};
	return {
		getAccessToken,
		setAccessToken,
		clearAccessToken,
	};
};

const authTokenStore = createAuthTokenStore();
export default authTokenStore;
