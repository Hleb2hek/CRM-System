import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { AuthState, RejectValue, UserRegistration } from '../../models/authorizationType';

const initialState: AuthState = {
	loading: false,
	userAuth: false,
	error: null,
	accessToken: null,
};

export const registerUser = createAsyncThunk<void, UserRegistration, { rejectValue: RejectValue }>(
	'registration/registerUser',
	async (data, { rejectWithValue }) => {
		try {
			const payload = { ...data };
			if (!payload.phoneNumber?.trim()) {
				delete payload.phoneNumber;
			}

			await axios.post('https://easydev.club/api/v1/auth/signup', payload);
		} catch (error: any) {
			if (error.response) {
				const status = error.response.status;
				let message = 'Произошла неизвестная ошибка';

				if (status === 404) {
					message = 'Сервис временно недоступен. Попробуйте позже.';
				} else if (status === 409) {
					message = 'Пользователь с таким логином или email уже существует';
				} else if (status >= 500) {
					message = 'Ошибка сервера. Попробуйте позже.';
				}

				return rejectWithValue({ status, message });
			}
			return rejectWithValue({ message: 'Ошибка сети. Проверьте подключение.' });
		}
	},
);

export const registrationSlice = createSlice({
	name: 'registration',
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(registerUser.pending, (state) => {
				state.loading = true;
				state.error = null;
				state.userAuth = false;
			})
			.addCase(registerUser.fulfilled, (state) => {
				state.loading = false;
				state.userAuth = true;
				state.error = null;
			})
			.addCase(registerUser.rejected, (state, action) => {
				state.loading = false;
				state.userAuth = false;
				state.error = action.payload?.message || 'Неизвестная ошибка регистрации';
			});
	},
});

export default registrationSlice.reducer;
