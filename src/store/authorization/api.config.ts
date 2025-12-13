import axios from 'axios';

export const instance = axios.create({
	baseURL: 'https://easydev.club/api/v1/auth',
	withCredentials: true,
});

instance.interceptors.request.use((config) => {
	const token = localStorage.getItem('token');
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
			} catch (refreshError) {
				localStorage.removeItem('token');
				console.log('AUTH ERROR: сессия истекла');
				window.location.href = '/';
				return Promise.reject(refreshError);
			}
		}
		return Promise.reject(error);
	},
);
