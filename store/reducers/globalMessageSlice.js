import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../Api";

export const globallMessageRequest = createAsyncThunk(
  "globalMessage",
  async ({ name, token }) => {
    api
      .post("/notification-control/global-message-email", {
        global_message_email: name,
        secret_token: token,
      })
      .then((res) => {
        return res;
      })
      .catch((error) => {
        return error;
      });
  }
);

const globallMessageSlice = createSlice({
  name: "globalMessage",
  initialState: {
    loading: false,
    error: false,
    data: [],
  },
  reducers: {},
  extraReducers: (builder) => {
    builder

      .addCase(globallMessageRequest.pending, (state) => {
        state.loading = true;
      })
      .addCase(globallMessageRequest.fulfilled, (state) => {
        state.error = false;
      })
      .addCase(globallMessageRequest.rejected, (state) => {
        state.error = true;
        state.loading = false;
      });
  },
});

export default globallMessageSlice.reducer;
