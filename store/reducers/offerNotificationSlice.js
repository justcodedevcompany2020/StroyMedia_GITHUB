import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../Api";

export const offerlNotificationRequest = createAsyncThunk(
  "offerlNotification",
  async ({ token, name }) => {
    try {
      const response = await api.post(
        "/notification-control/offers-push-notification",
        {
          secret_token: token,
          offer_push_nothify: name,
        }
      );
      return response;
    } catch (error) {
      return error;
    }
  }
);

const offerlNotificationSlice = createSlice({
  name: "offerlNotification",
  initialState: {
    loading: false,
    error: false,
    data: [],
  },
  reducers: {},
  extraReducers: (builder) => {
    builder

      .addCase(offerlNotificationRequest.pending, (state) => {
        state.loading = true;
      })

      .addCase(offerlNotificationRequest.fulfilled, (state, action) => {
        state.data = action.payload;
        state.error = false;
      })

      .addCase(offerlNotificationRequest.rejected, (state) => {
        state.error = true;
        state.loading = false;
      });
  },
});

export default offerlNotificationSlice.reducer;
