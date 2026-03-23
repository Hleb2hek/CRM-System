export interface UserFilters {
	search?: string;
	sortBy?: string;
	sortOrder?: 'asc' | 'desc';
	isBlocked?: boolean;
	limit?: number;
	page?: number;
	offset?: number;
}

export interface User {
	id: number;
	username: string;
	email: string;
	date: string;
	isBlocked: boolean;
	roles: Roles[];
	phoneNumber: string;
}

export type UserRolesRequest = Pick<User, 'roles'>;

export interface UserRequest {
	username?: string;
	email?: string;
	phoneNumber?: string;
}

export enum Roles {
	ADMIN = 'ADMIN',
	MODERATOR = 'MODERATOR',
	USER = 'USER',
}
