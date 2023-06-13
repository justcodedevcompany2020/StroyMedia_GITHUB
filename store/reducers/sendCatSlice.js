import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const sendCatRequest = createAsyncThunk( "sendCat", async (
  data,
  {
    rejectWithValue
  }
) => {
  console.log( "data", data, "data" );
  try {
    const response = fetch( "https://teus.online/api/cat-serv-send", {
      method : "POST",
      headers : { "Content-Type" : "multipart/form-data" },
      body : data
    } )
      .then( response => response.json() )
      .then( result => {
        console.log( "result", result, "result" );
        return result;
      } );

    // const result = await response.json();

    // return result;
  } catch( error ) {
    console.log( "error", error, "error" );
    return rejectWithValue( error );
  }
} );

const sendCatSlice = createSlice( {
  name : "sendCat",
  initialState : {
    loading : false,
    error : false,
    data : [],
  },
  reducers : {},
  extraReducers : ( builder ) => {
    builder

      .addCase( sendCatRequest.pending, ( state ) => {
        state.loading = true;
      } )

      .addCase( sendCatRequest.fulfilled, (
        state,
        action
      ) => {
        state.data = action.payload;
        state.error = false;
      } )

      .addCase( sendCatRequest.rejected, ( state ) => {
        state.error = true;
        state.loading = false;
      } );
  },
} );

export default sendCatSlice.reducer;
