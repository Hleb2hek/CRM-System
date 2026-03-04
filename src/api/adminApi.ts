import { httpClient } from '.';
import { MetaResponse, User, UserRequest, UserRolesRequest, UserFilters } from '../types/admin';

export const getListUsers = async (filters?: UserFilters): Promise<MetaResponse<User>> => {
	const response = await httpClient.get<MetaResponse<User>>('/admin/users', {
		params: { ...filters },
	});
	return response.data;
};

export const getUserById = async (id: number): Promise<User> => {
	const response = await httpClient.get<User>(`/admin/users/${id}`);
	return response.data;
};

export const updateUser = async (id: number, data: UserRequest): Promise<UserRequest> => {
	const response = await httpClient.put<UserRequest>(`/admin/users/${id}`, data);
	return response.data;
};

export const updateUserRoles = async (id: number, data: UserRolesRequest): Promise<User> => {
	const response = await httpClient.post<User>(`/admin/users/${id}/rights`, data);
	return response.data;
};

export const blockUser = async (id: number): Promise<User> => {
	const response = await httpClient.post<User>(`/admin/users/${id}/block`);
	return response.data;
};

export const unblockUser = async (id: number): Promise<User> => {
	const response = await httpClient.post<User>(`/admin/users/${id}/unblock`);
	return response.data;
};

export const deleteUser = async (id: number): Promise<void> => {
	await httpClient.delete(`/admin/users/${id}`);
};
