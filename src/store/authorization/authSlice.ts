import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { AuthData, ErrorStatus, Token } from '../../models/authorizationType';
import { instance } from './api.config';

const initialState: AuthData = {
	login: '',
	password: '',
};

export const authUser = createAsyncThunk<Token, AuthData>(
	'authorization/authUser',
	async (data: AuthData, { rejectWithValue }) => {
		try {
			const response = await instance.post('/signin', data);
<<<<<<< HEAD
			localStorage.setItem('token', response.data.accessToken);
=======
>>>>>>> a0bb0e862f048b757bf6278e004126576c9d0b34
			return response.data;
		} catch (error: unknown) {
			function isError(error: any): error is ErrorStatus {
				return error;
			}
			if (isError(error)) {
				if (error.response) {
					if (error.response.status === 404) {
						return rejectWithValue({
							status: 404,
							message: 'Сервис недоступен. Попробуйте позже.',
						});
					}
					if (error.response.status === 401 || error.response.status === 403) {
						return rejectWithValue({
							status: error.response.status,
							message: 'Неверный логин или пароль',
						});
					}
					return rejectWithValue({
						status: error.response.status,
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

export const refreshToken = createAsyncThunk(
	'authorization/refreshToken',
	async (_, { rejectWithValue }) => {
		try {
			const response = await instance.get('/refresh');
			localStorage.setItem('token', response.data.accessToken);
			return response.data;
		} catch (error: unknown) {
			function isError(error: any): error is ErrorStatus {
				return error;
			}
			if (isError(error)) {
				if (error.response) {
					if (error.response.status === 401) {
						return rejectWithValue({
							status: error.response.status,
							message: 'Неверный логин или пароль',
						});
					}
					return rejectWithValue({
						status: error.response.status,
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
