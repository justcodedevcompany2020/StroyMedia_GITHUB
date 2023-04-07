import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../Api";

export const deleteChatRequest = createAsyncThunk(
  "deletChat",
  async ({ token, id }) => {
    api
      .post("/user-chat-delete", { secret_token: token, last_id: id })
      .then((res) => {
        return res;
      })
      .catch((error) => {
        return error.message;
      });
  }
);
const deletChatSlice = createSlice({
  name: "deletChat",
  initialState: {
    loading: false,
    error: false,
    data: "",
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(deleteChatRequest.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteChatRequest.fulfilled, (state, action) => {
        state.error = false;
      })
      .addCase(deleteChatRequest.rejected, (state) => {
        state.error = true;
        state.loading = false;
      });
  },
});

export default deletChatSlice.reducer;
