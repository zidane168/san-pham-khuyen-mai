import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import { createWrapper } from 'next-redux-wrapper';
import productsSlice from '@app/features/productSlice';
import vouchersSlice from '@app/features/voucherSlice';

export const makeStore = () => 
  configureStore({
    reducer: {
      products: productsSlice,
      vouchers: vouchersSlice,
    },
  });

export type AppStore = ReturnType<typeof makeStore>;
export type AppState = ReturnType<AppStore['getState']>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  AppState,
  unknown,
  Action
>;
 
export type AppDispatch = AppStore['dispatch'];


export const wrapper = createWrapper<AppStore>(makeStore);
 
