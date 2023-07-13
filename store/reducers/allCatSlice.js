import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../../Api";
import axios from "axios";

export const allCatRequest = createAsyncThunk(
  "allCat",
  async ({ token, tab, offset }) => {
    var formdata = new FormData();
    formdata.append(
      "secret_token",
      token || (await AsyncStorage.getItem("token"))
    );
    formdata.append("type_request", tab);
    formdata.append("offset", offset);

    var requestOptions = {
      method: "POST",
      body: formdata,
      redirect: "follow",
    };

    try {
      const response = await fetch(
        "https://teus.online/api/cat-request-all",
        requestOptions
      );
      const data = await response.json();
      // if (tab == "closed") {
      //   console.log(data);
      // }
      // console.log(data.data.aplications.aplications)
      return data;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }
);

const allCatSlice = createSlice({
  name: "allCat",
  initialState: {
    loading: false,
    error: false,
    data: [],
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(allCatRequest.pending, (state) => {
        state.loading = true;
      })
      .addCase(allCatRequest.fulfilled, (state, action) => {
        state.data = action.payload?.data?.aplications?.aplications;
        state.error = false;
        state.loading = false;
      })
      .addCase(allCatRequest.rejected, (state) => {
        state.error = true;
        state.loading = false;
      });
  },
});

export default allCatSlice.reducer;
