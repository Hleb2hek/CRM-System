import axios from 'axios';
import { getTokens, setTokens } from './auth.service';

export const instance = axios.create({
	baseURL: 'https://easydev.club/api/v1/auth',
	withCredentials: true,
});

instance.interceptors.request.use((config) => {
	const { accessToken } = getTokens();
	console.log(accessToken);
	console.log(config);
	if (accessToken) {
		config.headers.Authorization = `Bearer ${accessToken}`;
	}
	return config;
});

instance.interceptors.response.use(
	(response) => {
		console.log(response);
		return response;
	},
	async (error) => {
		const originalRequest = error.config;
		if (
			error.response.status === 401 &&
			!originalRequest._retry &&
			originalRequest.url?.includes('/refresh')
		) {
			originalRequest._retry = true;
			const { refreshToken } = getTokens();
			if (refreshToken) {
				try {
					const res = await axios.post('https://easydev.club/api/v1/auth/refresh', {
						refreshToken,
					});
					setTokens(res.data);
					originalRequest.headers.Authorization = `Bearer ${res.data.accessToken}`;
					return instance(originalRequest);
				} catch (refreshError) {
					localStorage.clear();
				}
			}
		}
		return Promise.reject(error);
	},
);

export default instance;
