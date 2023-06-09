import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../../Api";

export const chatForumOrderRequest = createAsyncThunk(
  "forum/order",
  async ( data, { rejectWithValue } ) => {
    try {
      const result = await api.post( "/auth-chat-forum-order", {
        secret_token : data.token,
        last_id : data.id,
      } );
      return result.data;
    } catch( error ) {
      return rejectWithValue.error.data;
    }
  }
);

const orderChatForumSlice = createSlice( {
  name : "order/forum",
  initialState : {
    loading : false,
    error : false,
    data : [],
    dialog_message : []
  },
  reducers : {},
  extraReducers : ( builder ) => {
    builder

      .addCase( chatForumOrderRequest.pending, ( state ) => {
        // state.loading = true;
      } )

      .addCase( chatForumOrderRequest.fulfilled, ( state, action ) => {
        state.loading = false;
        state.dialog_message = action.payload.data.messages;
      } )

      .addCase( chatForumOrderRequest.rejected, ( state ) => {
        state.loading = false;
      } );
  },
} );

export default orderChatForumSlice.reducer;
