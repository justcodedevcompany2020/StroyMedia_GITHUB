import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../Api";

export const forgotPasswordRequest = createAsyncThunk(
  "forgotPassword",
  async ({ email }) => {
    await api
      .post("/user-lost-start", { email: email })
      .then((result) => {
        return result;
      })
      .catch((error) => {
        return error;
      });
  }
);

const forgotPasswordSlice = createSlice({
  name: "forgotPassword",
  initialState: {
    loading: false,
    error: false,
    success: false,
  },
  reducers: {
    changeAnswerForgotPassword(state) {
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(forgotPasswordRequest.pending, (state) => {
        state.loading = true;
      })
      .addCase(forgotPasswordRequest.fulfilled, (state, action) => {
        state.error = false;
        state.success = true;
      })
      .addCase(forgotPasswordRequest.rejected, (state) => {
        state.error = true;
        state.loading = false;
      });
  },
});

export default forgotPasswordSlice.reducer;
export const { changeAnswerForgotPassword } = forgotPasswordSlice.actions;
