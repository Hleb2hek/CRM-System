import axios from 'axios';
import authTokenStore from '../utils/authTokenStore';
import { refreshTokenSession } from './usersApi';

export const API = 'https://easydev.club/api/v1';

export const instance = axios.create({
	baseURL: API,
});

instance.interceptors.request.use((config) => {
	const token = authTokenStore.getAccessToken();

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
					authTokenStore.setAccessToken(response.accessToken);
					return instance(originalRequest);
				}
			} catch {
				originalRequest._retry = false;
			}
		}

		return Promise.reject(error);
	},
);
