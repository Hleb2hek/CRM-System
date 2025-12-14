import axios from 'axios';
const instance = axios.create({
	baseURL: 'https://easydev.club/api/v1/auth',
	withCredentials: true,
});

instance.interceptors.request.use(
	(config) => {
		const token = localStorage.getItem('accessToken');

		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
		}

		return config;
	},
	function (error) {
		return Promise.reject(error);
	},
);

instance.interceptors.response.use(
	(response) => {
		console.log(response.data);
		return response;
	},
	(error) => {
		if (error.response && error.response.status === 401) {
			localStorage.removeItem('accessToken');
		}
		return Promise.reject(error);
	},
);

export default instance;
