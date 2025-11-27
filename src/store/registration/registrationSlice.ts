import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { UserRegistration } from '../../models/authorizationType';

const initialState: UserRegistration = {
	login: '',
	username: '',
	password: '',
	email: '',
	phoneNumber: '',
};

export const registerUser = createAsyncThunk(
	'registration/registerUser',
	async (data: UserRegistration, { rejectWithValue }) => {
		try {
			console.log('Отправляемые данные:', data);

			const response = await axios.post('https://easydev.club/api/v1/auth/signup', data);
			return response.data;
		} catch (err: any) {
			console.log('Полная ошибка:', err.response);
			return rejectWithValue(err.response?.data?.message || err.message || 'Ошибка регистрации');
		}
	},
);

export const registrationSlice = createSlice({
	name: 'registration',
	initialState,
	reducers: {
		updateForm(state, action: PayloadAction<{ field: keyof UserRegistration; value: string }>) {
			const { field, value } = action.payload;
			state[field] = value;
		},
	},

	extraReducers: (builder) => {
		builder
			.addCase(registerUser.fulfilled, (state) => {
				Object.assign(state, initialState);
			})
			.addCase(registerUser.rejected, (state, action) => {
				console.error('Ошибка регистрации:', action.payload);
			});
	},
});

export const { updateForm } = registrationSlice.actions;

export default registrationSlice.reducer;
