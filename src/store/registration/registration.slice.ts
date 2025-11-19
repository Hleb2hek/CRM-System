// src/pages/registration.slice.ts
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

interface AuthState {
	loading: boolean;
	success: boolean;
	error: string | null;
}

const initialState: AuthState = {
	loading: false,
	success: false,
	error: null,
};

export const registerUser = createAsyncThunk(
	'auth/register',
	async (userData: any, { rejectWithValue }) => {
		try {
			const response = await axios.post('https://easydev.club/api/v1/auth/signup', userData, {
				headers: { 'Content-Type': 'application/json' },
			});
			return response.data;
		} catch (err: any) {
			const msg = err.response?.data?.message || err.message || 'Ошибка регистрации';
			return rejectWithValue(msg);
		}
	},
);

const authSlice = createSlice({
	name: 'auth',
	initialState,
	reducers: {
		clearAuthStatus: (state) => {
			state.success = false;
			state.error = null;
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(registerUser.pending, (state) => {
				state.loading = true;
				state.error = null;
				state.success = false;
			})
			.addCase(registerUser.fulfilled, (state) => {
				state.loading = false;
				state.success = true;
			})
			.addCase(registerUser.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload as string;
			});
	},
});

export const { clearAuthStatus } = authSlice.actions;
export default authSlice.reducer;
