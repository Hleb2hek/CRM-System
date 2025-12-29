import axios from 'axios';
import { selectAccessToken, store } from '../store';
import { Token } from '../../models/authorizationType';
import { logout, setAccessToken } from './authSlice';

export const instance = axios.create({
	baseURL: 'https://easydev.club/api/v1',
	withCredentials: true,
});

instance.interceptors.request.use((config) => {
	const token = selectAccessToken(store.getState());
	if (token) {
		config.headers.Authorization = `Bearer ${token}`;
	}
	return config;
});

instance.interceptors.response.use(
	(config) => config,
	async (error) => {
		const originalRequest = error.config;

		if (error.response?.status === 401 && !originalRequest._retry) {
			originalRequest._retry = true;
			const refreshToken = localStorage.getItem('refreshToken');

			if (!refreshToken) {
				store.dispatch(logout());
				return Promise.reject(error);
			}

			try {
				const res = await axios.post<Token>('https://easydev.club/api/v1/auth/refresh', {
					refreshToken,
				});

				store.dispatch(setAccessToken(res.data.accessToken));

				originalRequest.headers.Authorization = `Bearer ${res.data.accessToken}`;
				console.log(instance(originalRequest));
				return instance(originalRequest);
			} catch {
				store.dispatch(logout());
			}
		}

		return Promise.reject(error);
	},
);
export default instance;
