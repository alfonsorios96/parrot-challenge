import {configureStore} from '@reduxjs/toolkit';
import userReducer, {selectUser, saveSession, resetSession} from './reducers/user';
import spinnerReducer, {toggleSpinner, isShowing} from './reducers/spinner';

export {
    selectUser, saveSession, resetSession,
    toggleSpinner, isShowing
};

export default configureStore({
    reducer: {
        user: userReducer,
        spinner: spinnerReducer
    },
})
