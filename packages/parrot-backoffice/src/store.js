import {configureStore} from '@reduxjs/toolkit';
import userReducer from './reducers/user';
import spinnerReducer from './reducers/spinner';

export default configureStore({
    reducer: {
        user: userReducer,
        spinner: spinnerReducer
    },
})
