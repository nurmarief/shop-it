import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
}

export const userSlice = createSlice({
  initialState,
  name: 'userSlice',
  reducers: {
    setUser(state, action) {
      state.user = action.payload;
    },
    setIsAuthenticated(state, action) {
      state.isAuthenticated = action.payload;
    },
    setIsLoading(state, action) {
      state.isLoading = action.payload;
    }
  }
});

export const {
  setUser,
  setIsAuthenticated,
  setIsLoading
} = userSlice.actions;

export default userSlice.reducer;
