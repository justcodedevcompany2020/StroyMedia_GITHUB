import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../../Api";

export const authRequest = createAsyncThunk(
  "authUser",
  async ( secret_token ) => {
    try {
      const result = await api.post( "/get-auth-data", secret_token );
      return result.data;
    } catch ( error ) {
      return error;
    }
  }
);

const authUserSlice = createSlice( {
  name : "authUser",
  initialState : {
    loading : false,
    error : false,
    data : [],
  },
  reducers : {},
  extraReducers : ( builder ) => {
    builder

      .addCase( authRequest.pending, ( state ) => {
        state.loading = true;
      } )

      .addCase( authRequest.fulfilled, ( state, action ) => {
        state.data = action.payload.data;
        state.loading = false;
      } )

      .addCase( authRequest.rejected, ( state ) => {
        state.loading = false;
      } );
  },
} );

export default authUserSlice.reducer;
