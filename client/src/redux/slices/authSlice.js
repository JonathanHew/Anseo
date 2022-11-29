import { createSlice } from "@reduxjs/toolkit";

const initalState = {
  isAuth: false,
};

export const authSlice = createSlice({
  name: "auth",
  initalState,
  reducers: {
    authenticateUser: (state) => {
        state.isAuth = true;
    },
    unauthenticateUser: (state) => {
        state.isAuth = false ;
    }
  },
});

export const {authenticateUser, unauthenticateUser} = authSlice.actions;

export default authSlice.reducer;
