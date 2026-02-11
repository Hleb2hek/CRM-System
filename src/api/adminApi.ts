import { AxiosError } from 'axios';
import { instance } from '.';
import { MetaResponse, User, UserRequest, UserRolesRequest, UserFilters } from '../types/admin';

export const getListUsers = async (filters?: UserFilters) => {
	try {
		const response = await instance.get<MetaResponse<User>>('/admin/users', {
			params: filters,
		});
		return response.data;
	} catch (error) {
		throw new AxiosError('Не удаётся получить список пользователей');
	}
};

export const getUserById = async (id: number) => {
	try {
		const response = await instance.get<User>(`/admin/users/${id}`);
		return response.data;
	} catch (error) {
		throw new AxiosError('Не удалось загрузить пользователя');
	}
};
export const updateUser = async (id: number, data: UserRequest) => {
	try {
		const response = await instance.put<UserRequest>(`/admin/users/${id}`, data);
		return response.data;
	} catch (error: any) {
		console.log('← Ответ сервера:', error.response?.status, error.response?.data);
		throw error;
	}
};

export const updateUserRoles = async (id: number, data: UserRolesRequest) => {
	try {
		const response = await instance.put<User>(`/admin/users/${id}/rights`, data);
		return response.data;
	} catch (error) {
		throw new AxiosError('Не удалось обновить роли пользователя');
	}
};

export const blockUser = async (id: number) => {
	try {
		const response = await instance.post<User>(`/admin/users/${id}/block`);
		return response.data;
	} catch (error) {
		throw new AxiosError('Не удалось заблокировать пользователя');
	}
};

export const unblockUser = async (id: number) => {
	try {
		const response = await instance.post<User>(`/admin/users/${id}/unblock`);
		return response.data;
	} catch (error) {
		throw new AxiosError('Не удалось разблокировать пользователя');
	}
};

export const deleteUser = async (id: number) => {
	try {
		await instance.delete(`/admin/users/${id}`);
	} catch (error) {
		throw new AxiosError('Не удалось удалить пользователя');
	}
};
