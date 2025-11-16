import { configureStore } from '@reduxjs/toolkit';
import { registrationSlice } from './registration/registration.slice';

export const store = configureStore({
	reducer: {
		registration: registrationSlice.reducer,
	},
});

console.log(registrationSlice.getInitialState());
