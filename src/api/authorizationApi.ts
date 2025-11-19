import axios from 'axios';
import { UserRegistration } from '../models/authorizationType';

const instance = axios.create({ baseURL: 'https://easydev.club/api/v1/auth' });

// Регистрация
async function registerUser(data: UserRegistration) {
	const response = await instance.post('/signup', data);
	return response.data;
}
