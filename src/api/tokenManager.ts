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

// class TokenManager {
// 	private accessToken = '';

// 	getAccessToken() {
// 		return this.accessToken;
// 	}

// 	getRefreshToken() {
// 		return localStorage.getItem('refreshToken');
// 	}

// 	setAccessToken(token: string) {
// 		this.accessToken = token;
// 	}

// 	setRefreshToken(token: string) {
// 		localStorage.setItem('refreshToken', token);
// 	}

// 	clearTokens() {
// 		this.accessToken = '';
// 		localStorage.removeItem('refreshToken');
// 	}
// }

export const tokenManager = createTokenManager();
export default tokenManager;
