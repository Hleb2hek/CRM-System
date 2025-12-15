import axios from 'axios';

export const instance = axios.create({
	baseURL: 'https://easydev.club/api/v1/auth',
	withCredentials: true,
});
// Проверка состояния путей
axios
	.get('http://localhost:5173')
	.then((response) => {
		console.log('User data:', response);
	})
	.catch((error) => {
		console.error('Error fetching users:', error);
	});

// Перехватчик запроса
instance.interceptors.request.use((config) => {
	// localStorage сохраняем accessToken
	console.log(config.headers.Authorization);
	const token = localStorage.getItem('accessToken');
	// Если есть токен, то сохраняем в конфиге токен с припиской Breare
	if (token) {
		config.headers.Authorization = `Bearer ${token}`;
	}

	return config;
});
export default instance;
instance.interceptors.response.use(
	(response) => {
		return response;
	},
	async (error) => {
		if (error.response.status === 401) {
			try {
				return axios(error.config);
			} catch (refreshError) {
				console.error('Token refresh failed:', refreshError);
				return Promise.reject(refreshError);
			}
		}

		return Promise.reject(error);
	},
);
