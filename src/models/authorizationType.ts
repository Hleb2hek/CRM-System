export interface UserRegistration {
	login: string;
	username: string;
	password: string;
	email: string;
	phoneNumber?: string;
}

export interface StatusState {
	showModal?: boolean;
	message: string | string[];
	type: 'success' | 'error' | null;
}

export interface ErrorStatus {
	message: string;
	status: number;
	response: {
		status: number;
		data?: any;
	};
}
export interface AuthData {
	login: string;
	password: string;
}

export interface AuthState {
	userToken: null | string;
	isAuthenticated: boolean;
}

export interface RefreshToken {
	refreshToken: string;
}

export interface Profile {
	id: number;
	username: string;
	email: string;
	date: string;
	isBlocked: boolean;
	phoneNumber: string;
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
