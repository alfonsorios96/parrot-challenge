import {createSlice} from '@reduxjs/toolkit';

export const userSlice = createSlice({
    name: 'user',
    initialState: {
        value: null
    },
    reducers: {
        saveSession: (state, action) => {
            // Redux Toolkit allows us to write "mutating" logic in reducers. It
            // doesn't actually mutate the state because it uses the Immer library,
            // which detects changes to a "draft state" and produces a brand new
            // immutable state based off those changes
            state.value = action.payload;
        },
        resetSession: (state) => {
            state.value = null;
        }
    },
});

export const selectUser = state => state.user.value;

// Action creators are generated for each case reducer function
export const {saveSession, resetSession} = userSlice.actions;

export default userSlice.reducer;
