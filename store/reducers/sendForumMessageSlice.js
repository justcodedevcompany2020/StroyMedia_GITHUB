import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";

export const sendForumMessageRequest = createAsyncThunk(
  "send/forum/message",
  async (data, rejectedWithValue) => {
    try {
      await fetch('https://teus.online/api/forum-send-message', {
        body: data.data,
        method: "POST"
      }).then(response => response.json()).then(result => {

        return result
      })
    } catch (error) {
      console.log(error.data, 'error.data')
      return rejectedWithValue(error.result.data);
    }
  }
);

const sendForumMessageSlice = createSlice({
  name: "send/forum/message",
  initialState: {
    loading: false,
    error: false,
    data: [],
  },
  reducers: {},
  extraReducers: (builder) => {
    builder

      .addCase(sendForumMessageRequest.pending, (state) => {
        state.loading = true;
      })
      .addCase(sendForumMessageRequest.fulfilled, (state, action) => {
        state.data = action.payload;
        state.error = false;
      })

      .addCase(sendForumMessageRequest.rejected, (state) => {
        state.error = true;
        state.loading = false;
      });
  },
});

export default sendForumMessageSlice.reducer;
