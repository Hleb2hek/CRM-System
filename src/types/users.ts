export interface UserRegistration {
	login: string;
	username: string;
	password: string;
	email: string;
	phoneNumber?: string;
}
export interface AuthData {
	login: string;
	password: string;
}

export interface AuthState {
	isAuthorization: boolean;
}

export interface ProfileState {
	data: ProfileUser | null;
	loading: boolean;
	error: string | null;
}

export interface RefreshToken {
	refreshToken: string;
}
export interface ProfileUser {
	id: number;
	username: string;
	email: string;
	date: string;
	isBlocked: boolean;
	phoneNumber: string;
	roles: string[];
}

export interface ProfileRequest {
	username: string;
	email: string;
	phoneNumber: string;
}
export interface PasswordRequest {
	password: string;
}
export interface Token {
	accessToken: string;
	refreshToken: string;
}
