import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { AuthData, AuthState, Token } from '../../models/authorizationType';
import instance from './api.config';
import { setTokens } from './auth.service';

const initialState: AuthState = {
	loading: false,
	userAuth: false,
};

export const authUser = createAsyncThunk<Token, AuthData>(
	'authorization/authUser',
	async (data: AuthData, { rejectWithValue }) => {
		try {
			const response = await instance.post<Token>('/signin', data);
			const { accessToken, refreshToken } = response.data;
			localStorage.setItem('refreshToken', refreshToken);
			localStorage.setItem('accessToken', accessToken);
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
					message: 'Произошла ошибка',
				});
			}
			return rejectWithValue({
				status: 500,
				message: 'Ошибка отправки данных',
			});
		}
	},
);
export const refreshToken = createAsyncThunk<Token, void, { rejectValue: { message: string } }>(
	'authorization/refreshToken',
	async (_, { rejectWithValue }) => {
		const refreshToken = localStorage.getItem('refreshToken');
		if (!refreshToken) {
			return rejectWithValue({ message: 'No refresh token' });
		}
		try {
			const response = await instance.post<Token>('/refresh', { refreshToken });
			setTokens(response.data);
			return response.data;
		} catch (error: any) {
			localStorage.clear();
			return rejectWithValue({ message: 'Refresh failed' });
		}
	},
);
export const authorizationSlice = createSlice({
	name: 'authorization',
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(authUser.pending, (state) => {
				state.loading = true;
			})
			.addCase(authUser.fulfilled, (state) => {
				state.loading = false;
				state.userAuth = true;
			})
			.addCase(authUser.rejected, (state) => {
				state.loading = false;
				state.userAuth = false;
			})
			.addCase(refreshToken.pending, (state) => {
				state.loading = true;
			})
			.addCase(refreshToken.fulfilled, (state) => {
				state.loading = false;
				state.userAuth = true;
			})
			.addCase(refreshToken.rejected, (state) => {
				state.loading = false;
				state.userAuth = false;
			});
	},
});
export default authorizationSlice.reducer;
