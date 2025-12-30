import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authorizationUser } from '../../services/usersApi';
import { AuthData, Token } from '../../types/users';

const initialState: AuthState = {
	loading: true,
	userAuth: false,
	error: null,
	accessToken: null,
};
export const authLogin = createAsyncThunk<Token, AuthData, { rejectValue: string }>(
	'authorization/authLogin',
	async (data, { rejectWithValue }) => {
		try {
			return await authorizationUser(data);
		} catch (error: any) {
			return rejectWithValue(error.message);
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
			.addCase(authLogin.pending, (state) => {
				state.loading = true;
			})
			.addCase(authLogin.fulfilled, (state, action) => {
				state.loading = false;
				state.userAuth = true;
				state.accessToken = action.payload.accessToken;
			})
			.addCase(authLogin.rejected, (state, action) => {
				state.loading = false;
				state.userAuth = false;
				state.accessToken = null;
				state.error = action.payload?.message || 'Неизвестная ошибка авторизации';
			});
	},
});
export const { logout, setAccessToken } = authorizationSlice.actions;
export default authorizationSlice.reducer;
