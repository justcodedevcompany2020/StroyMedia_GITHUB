import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../Api";

export const offerMessageRequest = createAsyncThunk(
  "offerMessage",
  async ({ token, name }) => {
    api
      .post("/notification-control/offers-message-email", {
        secret_token: token,
        offer_message_email: name,
      })
      .then((res) => {
        return res;
      })
      .catch((error) => {
        return error;
      });
  }
);

const offerMessageSlice = createSlice({
  name: "offerMessage",
  initialState: {
    loading: false,
    error: false,
    data: [],
  },
  reducers: {},
  extraReducers: (builder) => {
    builder

      .addCase(offerMessageRequest.pending, (state) => {
        state.loading = true;
      })

      .addCase(offerMessageRequest.fulfilled, (state, action) => {
        state.data = action.payload;
        state.error = false;
      })

      .addCase(offerMessageRequest.rejected, (state) => {
        state.error = true;
        state.loading = false;
      });
  },
});

export default offerMessageSlice.reducer;
