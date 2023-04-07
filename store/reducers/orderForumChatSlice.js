import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../Api";

export const chatForumOrderRequest = createAsyncThunk(
  "forum/order",
  async ({ token, id }) => {
    try {
      const result = await api.post("/auth-chat-forum-order", {
        secret_token: token,
        last_id: id,
      });
      return result;
    } catch (error) {
      return error;
    }
  }
);

const orderChatForumSlice = createSlice({
  name: "order/forum",
  initialState: {
    loading: false,
    error: false,
    data: [],
  },
  reducers: {},
  extraReducers: (builder) => {
    builder

      .addCase(chatForumOrderRequest.pending, (state) => {
        state.loading = true;
      })
      
      .addCase(chatForumOrderRequest.fulfilled, (state, action) => {
        state.data = action.payload.data.data;
        state.loading = false;
      })

      .addCase(chatForumOrderRequest.rejected, (state) => {
        state.loading = false;
      });
  },
});

export default orderChatForumSlice.reducer;
