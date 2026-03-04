import axios from 'axios';
import { apiBaseUrl, httpClient } from './index';
import { AuthData, Profile, RefreshToken, Token, UserRegistration } from '../types/users';

export const refreshAPI = axios.create({
	baseURL: apiBaseUrl,
	baseURL: apiBaseUrl,
});

export const loginUser = async (data: AuthData): Promise<Token> => {
	const response = await httpClient.post<Token>(`auth/signin`, data);
	return response.data;
};

export const registerUser = async (data: UserRegistration): Promise<void> => {
	const payload = { ...data };
	if (!payload.phoneNumber?.trim()) {
		delete payload.phoneNumber;
	}
	await httpClient.post('/auth/signup', payload);
};

export const getProfileUser = async (): Promise<Profile> => {
	const response = await httpClient.get<Profile>('/user/profile');
	return response.data;
};

export const refreshTokenSession = async (refreshToken: RefreshToken): Promise<Token> => {
	const response = await refreshAPI.post('/auth/refresh', refreshToken);
	const resData: Token = response.data;
	return resData;
};
