import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getProfileUser } from '../../services/usersApi';
import { Profile } from '../../types/users';

const initialState: ProfileState = {
	data: null,
	loading: false,
	error: null,
};

export const getProfile = createAsyncThunk<Profile, void, { rejectValue: string }>(
	'profile/getProfile',
	async (_, { rejectWithValue }) => {
		try {
			return await getProfileUser();
		} catch (error: any) {
			return rejectWithValue(error.message);
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
