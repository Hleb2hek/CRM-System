<<<<<<< HEAD
import axios from 'axios';
=======
import axios, { AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { Token } from '../../models/authorizationType';
>>>>>>> a0bb0e862f048b757bf6278e004126576c9d0b34

export const instance = axios.create({
	baseURL: 'https://easydev.club/api/v1/auth',
	withCredentials: true,
});
<<<<<<< HEAD

instance.interceptors.request.use((config) => {
	const token = localStorage.getItem('token');
=======
instance.interceptors.request.use((config: InternalAxiosRequestConfig) => {
	const token = localStorage.getItem('accessToken');
>>>>>>> a0bb0e862f048b757bf6278e004126576c9d0b34
	if (token) {
		config.headers.Authorization = `Bearer ${token}`;
	}
	return config;
});

instance.interceptors.response.use(
	(response) => response,
	async (error) => {
		const originalRequest = error.config;

		if (error.response?.status === 401 && !originalRequest._isRetry) {
			originalRequest._isRetry = true;

			try {
				const response = await instance.get('/refresh');
				const newToken = response.data.accessToken;

				localStorage.setItem('token', newToken);

				originalRequest.headers.Authorization = `Bearer ${newToken}`;

				return instance(originalRequest);
<<<<<<< HEAD
			} catch (refreshError) {
				localStorage.removeItem('token');
				console.log('AUTH ERROR: сессия истекла');
				window.location.href = '/';
				return Promise.reject(refreshError);
=======
			} catch (e) {
				localStorage.clear();
				window.location.href = '/';
				return Promise.reject(e);
>>>>>>> a0bb0e862f048b757bf6278e004126576c9d0b34
			}
		}
		return Promise.reject(error);
	},
);
