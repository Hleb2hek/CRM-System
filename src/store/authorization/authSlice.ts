import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { AuthData, ErrorStatus, RefreshToken } from '../../models/authorizationType';
import { instance } from './api.config';

const initialState: AuthData = {
	login: '',
	password: '',
};

export const authUser = createAsyncThunk(
	'authorization/authUser',
	async (data: AuthData, { rejectWithValue }) => {
		try {
			const response = await instance.post('/signin', data);
			localStorage.setItem('accessToken', response.data.accessToken);
			localStorage.setItem('refreshToken', response.data.refreshToken);
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
					if (err.response.status === 401 || err.response.status === 403) {
						return rejectWithValue({
							status: err.response.status,
							message: 'Неверный логин или пароль',
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

export const authSlice = createSlice({
	name: 'authorization',
	initialState,
	reducers: {
		authForm(state, action: PayloadAction<{ field: keyof AuthData; value: string }>) {
			const { field, value } = action.payload;
			state[field] = value;
		},
	},
});

export const { authForm } = authSlice.actions;

export default authSlice.reducer;
