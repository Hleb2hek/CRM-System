import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserRegistration } from '../../models/authorizationType';

const initialState: UserRegistration = {
	login: '',
	username: '',
	password: '',
	email: '',
	phoneNumber: '',
};

export const registrationSlice = createSlice({
	name: 'registration',
	initialState: initialState,
	reducers: {
		updateForm(state, action: PayloadAction<{ field: keyof UserRegistration; value: string }>) {
			const { field, value } = action.payload;
			state[field] = value;
		},
		resetForm() {
			return initialState;
		},
	},
});

export const { updateForm, resetForm } = registrationSlice.actions;
export default registrationSlice.reducer;
