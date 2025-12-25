import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { Profile, ProfileState, RejectValue } from '../../models/authorizationType';
import instance from '../authorization/api.config';

const initialState: ProfileState = {
	data: null,
	loading: false,
	error: null,
};

export const getProfile = createAsyncThunk<Profile, void, { rejectValue: RejectValue }>(
	'profile/getProfile',
	async (_, { rejectWithValue }) => {
		try {
			const response = await instance.get<Profile>('/user/profile');
			return response.data;
		} catch {
			return rejectWithValue({ message: 'Не удаётся связаться с сервером' });
		}
	},
);

const profileSlice = createSlice({
	name: 'profile',
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(getProfile.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(getProfile.fulfilled, (state, action) => {
				state.loading = false;
				state.data = action.payload;
			})
			.addCase(getProfile.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload?.message || 'Ошибка запроса';
			});
	},
});

export default profileSlice.reducer;
