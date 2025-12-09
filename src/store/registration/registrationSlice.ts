import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { ErrorStatus, UserRegistration } from '../../models/authorizationType';

const initialState: UserRegistration = {
	login: '',
	username: '',
	password: '',
	email: '',
	phoneNumber: '',
};

export const registerUser = createAsyncThunk(
	'registration/registerUser',
	async (data: UserRegistration, { rejectWithValue }) => {
		try {
			const response = await axios.post('https://easydev.club/api/v1/auth/signup', data);
			return response.data;
		} catch (error: unknown) {
			function isError(error: any): error is ErrorStatus {
				return error;
			}
			if (isError(error)) {
				const err: ErrorStatus = error;
				if (err.response) {
					if (err.response.status === 404) {
						return rejectWithValue({
							status: 404,
							message: 'Сервис недоступен. Попробуйте позже.',
						});
					}
					if (err.response.status === 409) {
						return rejectWithValue({
							status: err.response.status,
							message: 'Ошибка регистрации: такой логин или email уже существует',
						});
					}
					return rejectWithValue({
						status: err.response.status,
						message: 'Произошла ошибка',
					});
				}
				return rejectWithValue({
					status: 500,
					message: 'Ошибка отправки данных',
				});
			}
		}
	},
);

export const registrationSlice = createSlice({
	name: 'registration',
	initialState,
	reducers: {
		updateForm(state, action: PayloadAction<{ field: keyof UserRegistration; value: string }>) {
			const { field, value } = action.payload;
			state[field] = value;
		},
	},
});

export const { updateForm } = registrationSlice.actions;

export default registrationSlice.reducer;
