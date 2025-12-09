import axios, { AxiosResponse } from 'axios';
import { Token } from '../../models/authorizationType';

export const instance = axios.create({
	baseURL: 'https://easydev.club/api/v1/auth',
	withCredentials: true,
});
instance.interceptors.request.use((config) => {
	const token = localStorage.getItem('accessToken');
	if (token) {
		config.headers.Authorization = `Bearer ${token}`;
	}
	console.log(config);
	return config;
});
instance.interceptors.response.use(
	(response) => response,
	async (error) => {
		const originalRequest = error.config;

		if (error.response?.status === 401 && !originalRequest._retry) {
			originalRequest._retry = true;

			try {
				const savedRefreshToken = localStorage.getItem('refreshToken');

				if (!savedRefreshToken) {
					return Promise.reject(error);
				}

				const refreshResp: AxiosResponse<Token> = await instance.post('/refresh', {
					refreshToken: savedRefreshToken,
				});

				const newToken: Token = {
					accessToken: refreshResp.data.accessToken,
					refreshToken: refreshResp.data.refreshToken,
				};

				localStorage.setItem('accessToken', newToken.accessToken);
				localStorage.setItem('refreshToken', newToken.refreshToken);

				originalRequest.headers.Authorization = `Bearer ${newToken.accessToken}`;

				return instance(originalRequest);
			} catch (e) {
				return Promise.reject(e);
			}
		}

		return Promise.reject(error);
	},
);
