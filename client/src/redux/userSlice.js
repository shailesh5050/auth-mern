import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentUser: null,
  loding: false,
  error: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    signInStart: (state) => {
      state.loding = true;
    },
    signInSuccess: (state, action) => {
      (state.loading = false),
        (state.currentUser = action.payload),
        (state.error = false);
    },
    signInFail: (state, action) => {
      (state.loading = false),
        (state.currentUser = null),
        (state.error = action.payload);
    },
    updateUserSuccess: (state, action) => {
      (state.loding = false),
        (state.currentUser = action.payload),
        (state.error = false);
    },
    deleteUserSuccess: (state, action) => {
      (state.loding = false), (state.currentUser = null), (state.error = false);
    },
    signOutSuccess: (state, action) => {
      (state.loding = false), (state.currentUser = null), (state.error = false);
    },
  },
});
export const {
  updateUserSuccess,
  deleteUserSuccess,
  signInStart,
  signInFail,
  signInSuccess,
  signOutSuccess,
} = userSlice.actions;
export default userSlice.reducer;
