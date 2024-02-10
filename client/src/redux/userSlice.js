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
  },
});
export const { signInStart, signInFail, signInSuccess } = userSlice.actions;
export default userSlice.reducer;
