import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { registrationUser } from '../../services/usersApi';
import { UserRegistration } from '../../types/users';

const initialState: AuthState = {
	loading: false,
	userAuth: false,
	error: null,
	accessToken: null,
};

export const registerUser = createAsyncThunk<void, UserRegistration, { rejectValue: string }>(
	'registration/registerUser',
	async (data, { rejectWithValue }) => {
		try {
			return await registrationUser(data);
		} catch (error: any) {
			return rejectWithValue(error.message);
		}
	},
);

export const registrationSlice = createSlice({
	name: 'registration',
	initialState,
	reducers: {},
});

export default registrationSlice.reducer;
