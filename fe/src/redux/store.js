import { configureStore } from '@reduxjs/toolkit';
import { productsAPI } from './api/products';
import { authAPI } from './api/auth';
import { usersAPI } from './api/users';
import { ordersAPI } from './api/orders';
import { paymentsAPI } from './api/payments';
import userReducer from './features/userSlice';
import cartReducer from './features/cartSlice';

export const store = configureStore({
  reducer: {
    auth: userReducer,
    cart: cartReducer,
    [productsAPI.reducerPath]: productsAPI.reducer,
    [authAPI.reducerPath]: authAPI.reducer,
    [usersAPI.reducerPath]: usersAPI.reducer,
    [ordersAPI.reducerPath]: ordersAPI.reducer,
    [paymentsAPI.reducerPath]: paymentsAPI.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat([
    productsAPI.middleware,
    authAPI.middleware,
    usersAPI.middleware,
    ordersAPI.middleware,
    paymentsAPI.middleware,
  ]),
});