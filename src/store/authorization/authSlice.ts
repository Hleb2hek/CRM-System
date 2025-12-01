import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { AuthData } from '../../models/authorizationType';

const initialState: AuthData = {
	login: '',
	password: '',
};

export const authUser = createAsyncThunk(
	'registration/registerUser',
	async (data: AuthData, { rejectWithValue }) => {
		try {
			const response = await axios.post('https://easydev.club/api/v1/auth/signin', data);
			return response.data;
		} catch (err: any) {
			if (err.response) {
				return rejectWithValue(err.response.data);
			}
			return rejectWithValue({ message: 'Ошибка отправки данных' });
		}
	},
);

export const authSlice = createSlice({
	name: 'authorization',
	initialState,
	reducers: {
		authForm(state, action: PayloadAction<{ field: keyof AuthData; value: string }>) {
			const { field, value } = action.payload;
			state[field] = value;
		},
	},
});

export const { authForm } = authSlice.actions;

export default authSlice.reducer;
