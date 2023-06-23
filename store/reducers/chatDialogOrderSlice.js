import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {api} from "../../Api";

export const chatOrderRequest = createAsyncThunk(
  "order/chat",
  async (data, {rejectWithValue}) => {
    try {
      const result = await api.post("/auth-chat-dialog-order", {
        secret_token: data.token,
        last_id: data.id,
        // offset: data.offset
      });
      return result.data;
    } catch (error) {
      return rejectWithValue.error.data;
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
        state.data = action.payload.data
        state.loading = false;
      })
      .addCase(chatOrderRequest.rejected, (state) => {
        state.loading = false;
      });
  },
});

export default orderChatSlice.reducer;
