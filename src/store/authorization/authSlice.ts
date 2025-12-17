import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { AuthData, AuthState, ErrorStatus, Token } from '../../models/authorizationType';
import instance from './api.config';

const initialState: AuthState = {
	isAuth: false,
	isLoading: true,
};

export const authUser = createAsyncThunk(
	'authorization/authUser',
	async (data: AuthData, { rejectWithValue }) => {
		try {
			const response = await instance.post<Token>('/signin', data);
			const { accessToken, refreshToken } = response.data;
			localStorage.setItem('refreshToken', refreshToken);
			localStorage.setItem('accessToken', accessToken);
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
export const initAuth = createAsyncThunk(
	'authorization/initAuth',
	async (_, { rejectWithValue }) => {
		try {
			await instance.get('/todo');
			return true;
		} catch {
			return rejectWithValue(false);
		}
	},
);

export const authSlice = createSlice({
	name: 'authorization',
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(authUser.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(authUser.fulfilled, (state) => {
				state.isAuth = true;
				state.isLoading = false;
			})
			.addCase(authUser.rejected, (state) => {
				state.isAuth = false;
				state.isLoading = false;
			});

		builder
			.addCase(initAuth.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(initAuth.fulfilled, (state) => {
				state.isAuth = true;
				state.isLoading = false;
			})
			.addCase(initAuth.rejected, (state) => {
				state.isAuth = false;
				state.isLoading = false;
			});
	},
});

export default authSlice.reducer;
