import {createSlice} from '@reduxjs/toolkit';

export const spinnerSlice = createSlice({
    name: 'spinner',
    initialState: {
        value: false
    },
    reducers: {
        toggleSpinner: (state, action) => {
            state.value = action.payload;
        }
    },
});

export const isShowing = state => state.spinner.value;

export const {toggleSpinner} = spinnerSlice.actions;

export default spinnerSlice.reducer;
