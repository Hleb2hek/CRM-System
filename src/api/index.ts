import axios, { AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import authTokenStore from '../utils/authTokenStore';
import { refreshTokenSession } from './usersApi';

export const apiBaseUrl = 'https://easydev.club/api/v1';

export const httpClient = axios.create({
	baseURL: apiBaseUrl,
});

httpClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
	const token = authTokenStore.getAccessToken();
	config.headers.Authorization = `Bearer ${token}`;
	return config;
});

httpClient.interceptors.response.use(
	(config: AxiosResponse) => {
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

					return httpClient(originalRequest);
				}
			} catch {
				originalRequest._retry = false;
			}
		}

		return Promise.reject(error);
	},
);
