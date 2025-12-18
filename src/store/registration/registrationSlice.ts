import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { LoadingState, UserRegistration } from '../../models/authorizationType';
import axios from 'axios';

const initialState: LoadingState = {
	loading: false,
};

export const registerUser = createAsyncThunk<void, UserRegistration>(
	'registration/registerUser',
	async (data, { rejectWithValue }) => {
		try {
			await axios.post('https://easydev.club/api/v1/auth/signup', data);
		} catch (error: any) {
			if (error.response) {
				if (error.response.status === 404) {
					console.log('Сервис недоступен. Попробуйте позже.');
					return rejectWithValue({
						status: 404,
						message: 'Сервис недоступен. Попробуйте позже.',
					});
				}
				if (error.response.status === 409) {
					console.log('Ошибка регистрации: такой логин или email уже существует');
					return rejectWithValue({
						status: error.response.status,
						message: 'Ошибка регистрации: такой логин или email уже существует',
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

export const registrationSlice = createSlice({
	name: 'registration',
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(registerUser.pending, (state) => {
				state.loading = true;
			})
			.addCase(registerUser.fulfilled, (state) => {
				state.loading = false;
			})
			.addCase(registerUser.rejected, (state) => {
				state.loading = false;
			});
	},
});

export default registrationSlice.reducer;
