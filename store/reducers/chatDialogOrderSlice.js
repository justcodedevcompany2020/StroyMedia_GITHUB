import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../Api";

export const chatOrderRequest = createAsyncThunk(
  "order/chat",
  async ({ token, id }) => {
    try {
      const result = await api.post("/auth-chat-dialog-order", {
        secret_token: token,
        last_id: id,
      });
      return result;
    } catch (error) {
      return error;
    }
  }
);

const orderChatSlice = createSlice({
  name: "order/chat",
  initialState: {
    loading: false,
    error: false,
    data: [],
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(chatOrderRequest.pending, (state) => {
        state.loading = true;
      })
      .addCase(chatOrderRequest.fulfilled, (state, action) => {
        state.data = action.payload.data.data;
        state.loading = false;
      })
      .addCase(chatOrderRequest.rejected, (state) => {
        state.loading = false;
      });
  },
});

export default orderChatSlice.reducer;
