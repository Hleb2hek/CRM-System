import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { AuthData, LoadingState, Token } from '../../models/authorizationType';
import instance from './api.config';

const initialState: LoadingState = {
	loading: false,
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
			})
			.addCase(authUser.rejected, (state) => {
				state.loading = false;
			});
	},
});
export default authorizationSlice.reducer;
