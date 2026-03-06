import { createSlice } from '@reduxjs/toolkit';
import { AuthState } from '../../types/users';
import tokenManager from '../../utils/tokenManager';

const initialState: AuthState = {
	isAuthorization: false,
};

const authorizationSlice = createSlice({
	name: 'auth',
	initialState,
	reducers: {
		login(state) {
			state.isAuthorization = true;
		},
		logout(state) {
			state.isAuthorization = false;
			tokenManager.clearAccessToken();
		},
	},
});
export const { logout, login } = authorizationSlice.actions;
export default authorizationSlice.reducer;
