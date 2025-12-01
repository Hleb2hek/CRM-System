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
			const response = await axios.post('https://easydev.club/api/v1/auth/signup', data);
			return response.data;
		} catch (err: any) {
			if (err.response) {
				return rejectWithValue(err.response.data);
			}
			return rejectWithValue({ message: 'Ошибка отправки данных' });
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
});

export const { updateForm } = registrationSlice.actions;

export default registrationSlice.reducer;
