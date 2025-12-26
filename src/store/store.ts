import { configureStore } from '@reduxjs/toolkit';
import registrationReducer from './registration/registrationSlice';
import authorizationReducer from './authorization/authSlice';
import profileReducer from './profile/profileSlice';
import { useDispatch, useSelector } from 'react-redux';

export const store = configureStore({
	reducer: {
		registration: registrationReducer,
		authorization: authorizationReducer,
		profile: profileReducer,
	},
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const selectAccessToken = (state: RootState) => state.authorization.accessToken;
export const selectIsAuth = (state: RootState) => state.authorization.userAuth;
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
