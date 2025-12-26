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
	loading: boolean;
	userAuth: boolean;
	error: string | null;
	accessToken: string | null;
}

export interface RejectValue {
	message: string;
	status?: number;
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
export type ProfileState = {
	data: Profile | null;
	loading: boolean;
	error: string | null;
};

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
