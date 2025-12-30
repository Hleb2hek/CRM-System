import { AxiosError } from 'axios';
import { instance } from './index';
import { AuthData, Profile, Token, UserRegistration } from '../types/users';

export const authorizationUser = async (data: AuthData) => {
	try {
		const response = await instance.post<Token>(`auth/signin`, data);
		return response.data;
	} catch (error: any) {
		if (error.response) {
			if (error.response.status === 404) {
				throw new AxiosError('Сервис недоступен. Попробуйте позже.');
			}
			if (error.response.status === 401 || error.response.status === 403) {
				throw new AxiosError('Неверный логин или пароль');
			}
			throw new AxiosError('Произошла ошибка на сервере');
		}
		throw new AxiosError('Ошибка сети или отправки данных');
	}
};

export const registrationUser = async (data: UserRegistration) => {
	try {
		const payload = { ...data };
		if (!payload.phoneNumber?.trim()) {
			delete payload.phoneNumber;
		}
		await instance.post('/auth/signup', payload);
	} catch (error: any) {
		if (error.response) {
			if (error.response.status === 404) {
				throw new AxiosError('Сервис временно недоступен. Попробуйте позже.');
			}
			if (error.response.status === 409) {
				throw new AxiosError('Пользователь с таким логином или email уже существует');
			}
			throw new AxiosError('Ошибка сервера. Попробуйте позже.');
		}
		throw new AxiosError('Ошибка сервера. Попробуйте позже.');
	}
};

export const getProfileUser = async () => {
	try {
		const response = await instance.get<Profile>('/user/profile');
		return response.data;
	} catch {
		throw new AxiosError('Не удаётся связаться с сервером');
	}
};
