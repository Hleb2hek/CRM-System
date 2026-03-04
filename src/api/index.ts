import axios, { AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import tokenManager from '../utils/tokenManager';
import { refreshTokenSession } from './usersApi';

export const apiBaseUrl = 'https://easydev.club/api/v1';

export const httpClient = axios.create({
	baseURL: apiBaseUrl,
});

httpClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
	const token = tokenManager.getAccessToken();
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
				const refreshToken = tokenManager.getRefreshToken();
				if (refreshToken) {
					const response = await refreshTokenSession({ refreshToken });

					tokenManager.setRefreshToken(response.refreshToken);
					tokenManager.setAccessToken(response.accessToken);

					return httpClient(originalRequest);
				}
			} catch {
				originalRequest._retry = false;
			}
		}

		return Promise.reject(error);
	},
);
