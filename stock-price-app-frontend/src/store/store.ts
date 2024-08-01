import { configureStore } from '@reduxjs/toolkit';
import priceReducer from './priceSlice';
import thunk from 'redux-thunk';

const store = configureStore({
  reducer: {
    prices: priceReducer,
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
