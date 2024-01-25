import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cartItems: localStorage.getItem('cartItems')
    ? JSON.parse(localStorage.getItem('cartItems'))
    : [],
  shippingInfo: localStorage.getItem('shippingInfo')
    ? JSON.parse(localStorage.getItem('shippingInfo'))
    : {},
}

export const cartSlice = createSlice({
  initialState,
  name: 'cartSlice',
  reducers: {
    setCartItem: (state, action) => {
      const newItem = action.payload;
      const prevItemIndex = state.cartItems.findIndex((item) => item.product === newItem.product);

      if (prevItemIndex > -1) {
        state.cartItems[prevItemIndex] = newItem;
      } else {
        state.cartItems = [...state.cartItems, newItem];
      }

      localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
    },
    removeCartItem: (state, action) => {
      state.cartItems = state?.cartItems?.filter(item => item.product !== action.payload);
      localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
    },
    clearCart: (state, action) => {
      state.cartItems = [];
      localStorage.removeItem('cartItems');
    },
    saveShippingInfo: (state, action) => {
      state.shippingInfo = action.payload;
      localStorage.setItem('shippingInfo', JSON.stringify(state.shippingInfo));
    },
  }
});

export const {
  setCartItem,
  removeCartItem,
  saveShippingInfo,
  clearCart
} = cartSlice.actions;

export default cartSlice.reducer;
