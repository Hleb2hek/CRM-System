import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { StatusState } from '../../models/authorizationType';

const initialState: StatusState = {
	showModal: false,
	message: '',
	type: null,
};

export const statusSlice = createSlice({
	name: 'status',
	initialState,
	reducers: {
		openModal(state, action: PayloadAction<StatusState>) {
			state.showModal = true;
			state.message = action.payload.message;
			state.type = action.payload.type;
		},
		closeModal(state) {
			state.showModal = false;
			state.message = '';
			state.type = null;
		},
	},
});

export const { openModal, closeModal } = statusSlice.actions;
export default statusSlice.reducer;
