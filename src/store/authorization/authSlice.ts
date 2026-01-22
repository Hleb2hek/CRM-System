import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AuthState } from '../../types/users';
import authTokenStore from '../../utils/authTokenStore';

const initialState: AuthState = {
	isAuthorization: false,
};

const authorizationSlice = createSlice({
	name: 'auth',
	initialState,
	reducers: {
		login(state, action: PayloadAction<string>) {
			state.isAuthorization = true;
			localStorage.setItem('refreshToken', action.payload);
		},
		logout(state) {
			state.isAuthorization = false;
			authTokenStore.clearAccessToken();
			localStorage.removeItem('refreshToken');
		},
	},
});
export const { logout, login } = authorizationSlice.actions;
export default authorizationSlice.reducer;
