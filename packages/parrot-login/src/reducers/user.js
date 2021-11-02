import {createSlice} from '@reduxjs/toolkit';

export const userSlice = createSlice({
    name: 'user',
    initialState: {
        value: null
    },
    reducers: {
        saveSession: (state, action) => {
            state.value = action.payload;
        }
    },
});

export const selectUser = state => state.user.value;

export const {saveSession} = userSlice.actions;

export default userSlice.reducer;
