import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../../Api";
import axios from "axios";

export const allChatForumRequest = createAsyncThunk(
  "all/forum",
  async ({ token }) => {
    try {
      const result = await api.post("/auth-chat-forum-all", {
        secret_token: token,
      });

      return result;
    } catch (err) {
      if (axios.isAxiosError(err)) {
        let error = err;
        if (!error.response) {
          throw err;
        }
        return rejectWithValue(error.response.data);
      }
      throw err;
    }
  }
);

const allChatForumSlice = createSlice({
  name: "forum",
  initialState: {
    isLoading: false,
    error: false,
    data: [],
    last_messages: [],
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(allChatForumRequest.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(allChatForumRequest.fulfilled, (state, action) => {
        state.data = action.payload.data.data.contacts;

        if (state.last_messages.length === 0) {
          action.payload?.data?.data?.last_messages.forEach((item) => {
            state.last_messages.unshift(item[0]?.comment);
          });
        }

        state.error = false;
        state.isLoading = false;
      })
      .addCase(allChatForumRequest.rejected, (state) => {
        state.error = true;
        state.isLoading = false;
      });
  },
});

export default allChatForumSlice.reducer;
