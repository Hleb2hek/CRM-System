import { AxiosError } from 'axios';
import { instance } from '.';
import { MetaResponse, User, UserRequest, UserRolesRequest, UserFilters } from '../types/admin';

export const getListUsers = async (filters?: UserFilters): Promise<MetaResponse<User>> => {
	try {
		const response = await instance.get<MetaResponse<User>>('/admin/users', {
			params: filters,
		});
		return response.data;
	} catch (error) {
		throw new AxiosError('Не удаётся получить список пользователей');
	}
};

export const getUserById = async (id: number): Promise<User> => {
	try {
		const response = await instance.get<User>(`/admin/users/${id}`);
		return response.data;
	} catch (error) {
		throw new AxiosError('Не удалось загрузить пользователя');
	}
};

export const updateUser = async (id: number, data: UserRequest): Promise<User> => {
	try {
		const response = await instance.put<User>(`/admin/users/${id}`, data);
		return response.data;
	} catch (error) {
		throw new AxiosError('Не удалось обновить данные пользователя');
	}
};

export const updateUserRoles = async (id: number, data: UserRolesRequest): Promise<User> => {
	try {
		const response = await instance.put<User>(`/admin/users/${id}/rights`, data);
		return response.data;
	} catch (error) {
		throw new AxiosError('Не удалось обновить роли пользователя');
	}
};

export const blockUser = async (id: number): Promise<User> => {
	try {
		const response = await instance.post<User>(`/admin/users/${id}/block`);
		return response.data;
	} catch (error) {
		throw new AxiosError('Не удалось заблокировать пользователя');
	}
};

export const unblockUser = async (id: number): Promise<User> => {
	try {
		const response = await instance.post<User>(`/admin/users/${id}/unblock`);
		return response.data;
	} catch (error) {
		throw new AxiosError('Не удалось разблокировать пользователя');
	}
};

export const deleteUser = async (id: number): Promise<void> => {
	try {
		await instance.delete(`/admin/users/${id}`);
	} catch (error) {
		throw new AxiosError('Не удалось удалить пользователя');
	}
};
