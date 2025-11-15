import axios from 'axios';
import { UserRegistration } from '../models/authorizationType';

const instance = axios.create({ baseURL: 'https://easydev.club/api/v1/auth' });

// Регистрация
export async function addAuthSign(obj: UserRegistration): Promise<UserRegistration> {
	try {
		const response = await instance.post<UserRegistration>('/signup', obj);
		return response.data;
	} catch (error) {
		throw new Error(`Ошибка отправки данных`);
	}
}
