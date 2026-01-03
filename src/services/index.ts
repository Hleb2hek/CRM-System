import axios from 'axios';
import authClass from '../utils/AuthClass';
import { refreshTokenSession } from './usersApi';

export const instance = axios.create({
	baseURL: 'https://easydev.club/api/v1',
});

instance.interceptors.request.use((config) => {
	const token = authClass.getAccessToken();

	config.headers.Authorization = `Bearer ${token}`;
	return config;
});

instance.interceptors.response.use(
	(config) => {
		return config;
	},
	async (error) => {
		const originalRequest = error.config;

		if (error.response?.status === 401 && !originalRequest._retry) {
			originalRequest._retry = true;
			try {
				const refreshToken = localStorage.getItem('refreshToken');
				if (refreshToken) {
					const response = await refreshTokenSession({ refreshToken });
					localStorage.setItem('refreshToken', response.refreshToken);
					authClass.setAccessToken(response.accessToken);
					return instance(originalRequest);
				}
			} catch {
				originalRequest._retry = false;
			}
		}

		return Promise.reject(error);
	},
);
