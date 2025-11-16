import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserRegistration } from '../../models/authorizationType';

const initialState: UserRegistration = {
	login: '2',
	username: '3',
	password: '4',
	email: '5',
	phoneNumber: '6',
};

export const registrationSlice = createSlice({
	name: 'registration',
	initialState: initialState,
	reducers: {
		login(state, action: PayloadAction<string>) {
			state.login = action.payload;
		},
		username(state) {
			state.username;
		},
		password(state) {
			state.password;
		},
		email(state) {
			state.email;
		},
		phoneNumber(state) {
			state.phoneNumber;
		},
		// incrementByAmount(state, action: PayloadAction<number>) {
		// 	state.value += action.payload;
		// },
	},
});

export const { login, username, password, email, phoneNumber } = registrationSlice.actions;
