import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {api} from "../../Api";

export const sendForumMessageRequest = createAsyncThunk(
    "send/forum/message",
    async (data, rejectedWithValue) => {
      
      const requestOptions = {
        method: 'POST',
        body: data.data,
        redirect: 'follow'
      };
      
      await fetch("https://teus.online/api/forum-send-message", requestOptions)
        .then(response => response.json())
        .then(result => console.log(result))
        .catch(error => console.log('error', error));
    }
  )
;

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
