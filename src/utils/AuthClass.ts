const authTokenData = () => {
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

const authClass = authTokenData();
console.log(authClass.getAccessToken());
export default authClass;
