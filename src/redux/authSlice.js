import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  token: localStorage.getItem('token') || null,
  isAuthenticated: !!localStorage.getItem('token'),
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setToken: (state, action) => {
      console.log('Setting token in Redux:', action.payload);
      state.token = action.payload;
      state.isAuthenticated = !!action.payload;
      if (action.payload) {
        console.log('Saving token to localStorage');
        localStorage.setItem('token', action.payload);
      } else {
        console.log('Removing token from localStorage');
        localStorage.removeItem('token');
      }
    },
    logout: (state) => {
      console.log('Logging out, clearing token');
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem('token');
    },
  },
});

export const { setToken, logout } = authSlice.actions;
export default authSlice.reducer; 