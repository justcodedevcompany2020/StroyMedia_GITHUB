import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../Api";

export const globallNotificationRequest = createAsyncThunk(
  "globallNotification",
  async ({ token, name }) => {
    try {
      const response = api.post(
        "/notification-control/global-push-notification",
        {
          secret_token: token,
          global_push_nothify: name,
        }
      );
      return response;
    } catch (error) {
      return error;
    }
  }
);

const globallNotificationSlice = createSlice({
  name: "globallNotification",
  initialState: {
    loading: false,
    error: false,
    data: [],
  },
  reducers: {},
  extraReducers: (builder) => {
    builder

      .addCase(globallNotificationRequest.pending, (state) => {
        state.loading = true;
      })
      .addCase(globallNotificationRequest.fulfilled, (state, action) => {
        state.data = action.payload;
        state.error = false;
      })

      .addCase(globallNotificationRequest.rejected, (state) => {
        state.error = true;
        state.loading = false;
      });
  },
});

export default globallNotificationSlice.reducer;
