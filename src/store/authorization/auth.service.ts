import { Token } from '../../models/authorizationType';

export const getTokens = () => {
	return {
		accessToken: localStorage.getItem('accessToken'),
		refreshToken: localStorage.getItem('refreshToken'),
	};
};

export const setTokens = ({ accessToken, refreshToken }: Token) => {
	localStorage.setItem('accessToken', accessToken);
	if (refreshToken) {
		localStorage.setItem('refreshToken', refreshToken);
	}
};
