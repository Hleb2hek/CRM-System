import { configureStore } from '@reduxjs/toolkit';

import authorizationReducer from './authorization/authSlice';
import { useDispatch, useSelector } from 'react-redux';

export const store = configureStore({
	reducer: {
		authorization: authorizationReducer,
	},
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
