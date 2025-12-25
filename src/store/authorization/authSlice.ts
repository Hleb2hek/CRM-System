import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { AuthData, AuthState, RejectValue, Token } from '../../models/authorizationType';
import instance from './api.config';
import { setTokens } from './auth.service';

const initialState: AuthState = {
	loading: false,
	userAuth: false,
	error: null,
};

export const authUser = createAsyncThunk<Token, AuthData, { rejectValue: RejectValue }>(
	'authorization/authUser',
	async (data: AuthData, { rejectWithValue }) => {
		try {
			const response = await instance.post<Token>('/auth/signin', data);
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
					message: 'Произошла ошибка на сервере',
				});
			}
			return rejectWithValue({
				message: 'Ошибка сети или отправки данных',
			});
		}
	},
);

// export const refreshToken = createAsyncThunk<Token, void, { rejectValue: RejectValue }>(
// 	'authorization/refreshToken',
// 	async (_, { rejectWithValue }) => {
// 		const refreshToken = localStorage.getItem('refreshToken');
// 		if (!refreshToken) {
// 			return rejectWithValue({ message: 'No refresh token' });
// 		}
// 		try {
// 			const response = await instance.post<Token>('/auth/refresh', { refreshToken });
// 			setTokens(response.data);
// 			return response.data;
// 		} catch (error: any) {
// 			localStorage.clear();
// 			return rejectWithValue({ message: 'Refresh token failed' });
// 		}
// 	},
// );

export const authorizationSlice = createSlice({
	name: 'authorization',
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(authUser.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(authUser.fulfilled, (state) => {
				state.loading = false;
				state.userAuth = true;
				state.error = null;
			})
			.addCase(authUser.rejected, (state, action) => {
				state.loading = false;
				state.userAuth = false;
				state.error = action.payload?.message || 'Неизвестная ошибка авторизации';
			});
		// .addCase(refreshToken.pending, (state) => {
		// 	state.loading = true;
		// })
		// .addCase(refreshToken.fulfilled, (state) => {
		// 	state.loading = false;
		// 	state.userAuth = true;
		// 	state.error = null;
		// })
		// .addCase(refreshToken.rejected, (state, action) => {
		// 	state.loading = false;
		// 	state.userAuth = false;
		// 	state.error = action.payload?.message || 'Сессия истекла';
		// });
	},
});

export default authorizationSlice.reducer;
