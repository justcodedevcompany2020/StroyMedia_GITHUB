import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../../Api";
import axios from "axios";

export const allChatForumRequest = createAsyncThunk( "all/forum", async ( { token } ) => {
  try {
    const result = await api.post( "/auth-chat-forum-all", {
      secret_token : token,
    } );

    return result;
  } catch( err ) {
    if( axios.isAxiosError( err ) ) {
      let error = err;
      if( !error.response ) {
        throw err;
      }
      return rejectWithValue( error.response.data );
    }
    throw err;
  }
} );

const allChatForumSlice = createSlice( {
  name : "forum",
  initialState : {
    loading : false,
    error : false,
    data : [],
    last_messages : []
  },
  reducers : {},
  extraReducers : ( builder ) => {
    builder

      .addCase( allChatForumRequest.pending, ( state ) => {
        state.loading = true;
      } )

      .addCase( allChatForumRequest.fulfilled, ( state, action ) => {
        state.data = action.payload.data.data.contacts;
        // state.last_messages = action.payload.data.data.last_messages;

        if( state.last_messages.length == 0 ) {
          action.payload?.data?.data?.last_messages.forEach( item => {
            state.last_messages.push( item[ 0 ]?.comment );
            // console.log( item[ 0 ]?.comment );
          } );
        }

        // console.log( state.last_messages, "i" );

        state.error = false;
        state.loading = false;
      } )

      .addCase( allChatForumRequest.rejected, ( state ) => {
        state.error = true;
        state.loading = false;
      } );
  },
} );

export default allChatForumSlice.reducer;
