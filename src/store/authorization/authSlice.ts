import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { AuthData, AuthState, RejectValue, Token } from '../../models/authorizationType';
import instance from './api.config';

const initialState: AuthState = {
	loading: true,
	userAuth: false,
	error: null,
	accessToken: null,
};
export const initAuth = createAsyncThunk<Token, void, { rejectValue: RejectValue }>(
	'authorization/initAuth',
	async (_, { rejectWithValue }) => {
		const refreshToken = localStorage.getItem('refreshToken');
		if (!refreshToken) return rejectWithValue({ message: 'Нет токена' });

		try {
			const response = await instance.post<Token>('/auth/refresh', { refreshToken });
			console.log(response);
			localStorage.setItem('refreshToken', response.data.refreshToken);
			return response.data;
		} catch (err: any) {
			localStorage.removeItem('refreshToken');
			return rejectWithValue({ message: 'Обновление провалилось' });
		}
	},
);
export const authUser = createAsyncThunk<Token, AuthData, { rejectValue: RejectValue }>(
	'authorization/authUser',
	async (data: AuthData, { rejectWithValue }) => {
		try {
			const response = await instance.post<Token>('/auth/signin', data);
			const { refreshToken } = response.data;

			localStorage.setItem('refreshToken', refreshToken);

			return response.data;
		} catch (error: any) {
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
					message: 'Произошла ошибка на сервере',
				});
			}
			return rejectWithValue({
				message: 'Ошибка сети или отправки данных',
			});
		}
	},
);

export const authorizationSlice = createSlice({
	name: 'authorization',
	initialState,
	reducers: {
		setAccessToken(state, action) {
			state.accessToken = action.payload;
		},
		logout(state) {
			state.userAuth = false;
			state.accessToken = null;
			state.error = null;
			localStorage.removeItem('refreshToken');
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(authUser.pending, (state) => {
				state.loading = true;
			})
			.addCase(authUser.fulfilled, (state, action) => {
				state.loading = false;
				state.userAuth = true;
				state.accessToken = action.payload.accessToken;
			})
			.addCase(authUser.rejected, (state, action) => {
				state.loading = false;
				state.userAuth = false;
				state.accessToken = null;
				state.error = action.payload?.message || 'Неизвестная ошибка авторизации';
			})
			.addCase(initAuth.pending, (state) => {
				state.loading = true;
			})
			.addCase(initAuth.fulfilled, (state, action) => {
				state.loading = false;
				state.userAuth = true;
				state.accessToken = action.payload.accessToken;
			})
			.addCase(initAuth.rejected, (state) => {
				state.loading = false;
				state.userAuth = false;
				state.accessToken = null;
			});
	},
});
export const { logout, setAccessToken } = authorizationSlice.actions;
export default authorizationSlice.reducer;
