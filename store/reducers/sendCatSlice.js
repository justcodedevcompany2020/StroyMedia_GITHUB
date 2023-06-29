import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const sendCatRequest = createAsyncThunk(
  "sendCat",
  async ({ formdata, myHeaders }) => {
    console.log(formdata);
    try {
      var requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: formdata,
        redirect: "follow",
      };

      const response = await fetch(
        "https://teus.online/api/cat-serv-send",
        requestOptions
      );
        console.log(response,18)
      const result = await response.json();

      return result;
    } catch (error) {
      // console.log(error);
      return error.response;
    }
  }
);

const sendCatSlice = createSlice({
  name: "sendCat",
  initialState: {
    loading: false,
    error: false,
    data: [],
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(sendCatRequest.pending, (state) => {
        state.loading = true;
      })
      .addCase(sendCatRequest.fulfilled, (state, action) => {
        state.data = action.payload;
        state.error = false;
      })
      .addCase(sendCatRequest.rejected, (state) => {
        state.error = true;
        state.loading = false;
      });
  },
});

export default sendCatSlice.reducer;
