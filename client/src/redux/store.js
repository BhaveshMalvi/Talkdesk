import {configureStore} from '@reduxjs/toolkit';
import authSlice from './reducers/auth';
import api from './api/api';
import miscSlice from './reducers/misc';
import chatSlice from './reducers/chat';

const store = configureStore({
    reducer: {
    [authSlice.name]: authSlice.reducer, 
    [miscSlice.name]: miscSlice.reducer, 
    [chatSlice.name]: chatSlice.reducer, 
    // eslint-disable-next-line no-undef
    [api.reducerPath]: api.reducer,
    },
    // eslint-disable-next-line no-undef
    middleware: (mid) => [ ...mid(), api.middleware]
});

export default store;