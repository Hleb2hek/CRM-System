import { AxiosError } from 'axios';
import { instance } from '.';
import { MetaResponse, User } from '../types/admin';

export const getListUsers = async (): Promise<MetaResponse<User>> => {
	try {
		const response = await instance.get<MetaResponse<User>>('/admin/users');
		return response.data;
	} catch (error) {
		throw new AxiosError(`Не удаётся связаться с сервером`);
	}
};
