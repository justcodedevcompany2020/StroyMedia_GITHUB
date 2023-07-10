import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../Api";

export const editAplicationsRequest = createAsyncThunk(
  "edit/aplication",
  async ({ formdata, myHeaders }) => {
    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: formdata,
      redirect: "follow",
    };
    try {
      const response = await fetch(
        "https://teus.online/api/cat-serv-edit",
        requestOptions
      );
      const result = await response.json();
      console.log(result);
      return result;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
);
const editAplicationsRequestSlice = createSlice({
  name: "edit/aplication",
  initialState: {
    loading: false,
    error: false,
    data: [],
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(editAplicationsRequest.pending, (state) => {
        state.loading = true;
      })
      .addCase(editAplicationsRequest.fulfilled, (state, action) => {
        state.data = action.payload;
        state.error = false;
        state.loading = false;
      })
      .addCase(editAplicationsRequest.rejected, (state) => {
        state.error = true;
        state.loading = false;
      });
  },
});

export default editAplicationsRequestSlice.reducer;
