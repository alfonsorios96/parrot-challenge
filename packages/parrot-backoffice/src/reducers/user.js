import {createSlice} from '@reduxjs/toolkit';

export const userSlice = createSlice({
    name: 'user',
    initialState: null,
    reducers: {
        add: (state, action) => {
            // Redux Toolkit allows us to write "mutating" logic in reducers. It
            // doesn't actually mutate the state because it uses the Immer library,
            // which detects changes to a "draft state" and produces a brand new
            // immutable state based off those changes
            state = action.user;
        },
        remove: (state) => {
            state = null
        },
        update: (state, action) => {
            state = {...state, ...action.user};
        },
    },
})

// Action creators are generated for each case reducer function
export const {add, remove, update} = userSlice.actions;

export default userSlice.reducer;
