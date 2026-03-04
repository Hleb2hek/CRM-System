import axios, { AxiosError } from 'axios';
import { httpClient, apiBaseUrl } from './index';
import { AuthData, Profile, RefreshToken, Token, UserRegistration } from '../types/users';

export const refreshAPI = axios.create({
	baseURL: apiBaseUrl,
});

export const loginUser = async (data: AuthData) => {
	try {
		const response = await httpClient.post<Token>(`auth/signin`, data);
		return response.data;
	} catch (error) {
		if (axios.isAxiosError(error)) {
			if (error.response?.status === 404) {
				throw new AxiosError('Сервис недоступен. Попробуйте позже.');
			}
			if (error.response?.status === 401 || error.response?.status === 403) {
				throw new AxiosError('Неверный логин или пароль');
			}
			throw new AxiosError('Произошла ошибка на сервере');
		}
		throw new Error('Неизвестная ошибка');
	}
};

export const registerUser = async (data: UserRegistration) => {
	try {
		const payload = { ...data };
		if (!payload.phoneNumber?.trim()) {
			delete payload.phoneNumber;
		}
		await httpClient.post('/auth/signup', payload);
	} catch (error) {
		if (axios.isAxiosError(error)) {
			if (error.response?.status === 404) {
				throw new AxiosError('Сервис временно недоступен. Попробуйте позже.');
			}
			if (error.response?.status === 409) {
				throw new AxiosError('Пользователь с таким логином или email уже существует');
			}
			throw new AxiosError('Ошибка сервера. Попробуйте позже.');
		}
	}
};

export const getProfileUser = async () => {
	try {
		const response = await httpClient.get<Profile>('/user/profile');
		return response.data;
	} catch {
		throw new AxiosError('Не удаётся связаться с сервером');
	}
};

export async function refreshTokenSession(refreshToken: RefreshToken) {
	try {
		const response = await refreshAPI.post('/auth/refresh', refreshToken);
		const resData: Token = response.data;
		return resData;
	} catch {
		throw new AxiosError('Не удаётся связаться с сервером');
	}
}
