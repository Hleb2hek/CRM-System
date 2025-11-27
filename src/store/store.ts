import { configureStore } from '@reduxjs/toolkit';
import registrationReducer from './registration/registrationSlice';
import { useDispatch } from 'react-redux';

export const store = configureStore({
	reducer: {
		registration: registrationReducer,
	},
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
