import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const sendForumMessageRequest = createAsyncThunk( "send/forum/message", async ( data, { rejectedWithValue } ) => {
  try {
    const requestOptions = {
      method : "POST",
      body : data.data,
    };

    const response = await fetch( "https://teus.online/api/forum-send-message", requestOptions );
    const result = await response.json();
    return result;
  } catch( e ) {
    return rejectedWithValue( e );
  }
} );

const sendForumMessageSlice = createSlice( {
  name : "send/forum/message",
  initialState : {
    loading : false,
    error : false,
    data : [],
  },
  reducers : {},


  extraReducers : ( builder ) => {
    builder

      .addCase( sendForumMessageRequest.pending, ( state ) => {
        state.loading = true;
      } )
      .addCase( sendForumMessageRequest.fulfilled, ( state, action ) => {
        state.data = action.payload;
        state.error = false;
      } )

      .addCase( sendForumMessageRequest.rejected, ( state ) => {
        state.error = true;
        state.loading = false;
      } );
  },
} );

export default sendForumMessageSlice.reducer;
