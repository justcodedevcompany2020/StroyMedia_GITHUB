import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";

export const sendMessageRequest = createAsyncThunk(
  "send/message",
  async (data, rejectedWithValue) => {
    try {
      const response = await fetch('https://teus.online/api/chat-send-message', {
        body: data.data,
        method: "POST"
      }).then(response => response.json()).then(result => {

        return result
      })

      // const data = await response.json()

      // const result = await api.post("/chat-send-message", data.data).then((r) => {
      //   alert("sendMessageRequest1")
      // }).catch((error) => {
      //   console.log(error, 'eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee')
      //   // alert("sendMessageRequest2")
      //
      // });


      // return data;
    } catch (error) {

      return rejectedWithValue(error.result.data);
    }
  }
);

const sendMessageSlice = createSlice({
  name: "send/message",
  initialState: {
    loading: false,
    error: false,
    send_message: [],
  },
  reducers: {},
  extraReducers: (builder) => {
    builder

      .addCase(sendMessageRequest.pending, (state) => {
        state.loading = true;
      })

      .addCase(sendMessageRequest.fulfilled, (state, action) => {
        state.send_message = action.payload;
        state.error = false;
      })

      .addCase(sendMessageRequest.rejected, (state) => {
        state.error = true;
        state.loading = false;
      });
  },
});

export default sendMessageSlice.reducer;
