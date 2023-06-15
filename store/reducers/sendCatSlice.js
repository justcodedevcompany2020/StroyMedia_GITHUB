import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const sendCatRequest = createAsyncThunk( "sendCat", async ( {
  formdata,
  myHeaders,
  form_data
} ) => {
  try {
    // var myHeaders = new Headers();
    // var formdata = new FormData();
    //
    // myHeaders.append( "Content-Type", "multipart/form-data" );
    //
    // formdata.append( "secret_token", data.token );
    // formdata.append( "last_id", data.changed_tab );
    // formdata.append( "price", data.price );
    // formdata.append( "dislokaciya", data.from_city.toString() );
    // formdata.append( "condition", data.new_or_used );
    // formdata.append( "description", data.comment );
    // formdata.append( "typepay", data.payType );
    // formdata.append( "reestrrzhd", data.restrick );
    // formdata.append( "type_container", data.typeKTK );
    // formdata.append( "currency", data.price_type );
    // formdata.append( "responsible", data.user );
    // formdata.append(
    //   "img",
    //   data.selectedImage,
    //   // name : data.fileName,
    //   // type : data.fileType
    // );
    // formdata.append( "_type_op", data.saveAsDraft ? "draft" : "onwork" );

    // console.log( data );
    var requestOptions = {
      method : "POST",
      headers : myHeaders,
      body : formdata || form_data,
      redirect : "follow"
    };

    console.log( "data", formdata, "data" );
    const response = await fetch( "https://teus.online/api/cat-serv-send", requestOptions );

    const result = await response.json();
    console.log( result );
    return result;
  } catch( error ) {
    console.log( "error", error, "error" );
    return rejectWithValue( error.response );
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
