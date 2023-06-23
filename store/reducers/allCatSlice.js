import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../../Api";
import axios from "axios";

export const allCatRequest = createAsyncThunk(
  "allCat",
  async ({ token, tab, offset }) => {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    let raw = {
      secret_token: token,
      type_request: tab === "В работе" ? "onwork" : "draft",
      // offset,
    };

    if (offset > 0) {
      raw.offset = offset;
    }

    let requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: JSON.stringify(raw),
      redirect: "follow",
    };

    try {
      const response = await fetch(
        "https://teus.online/api/cat-request-all",
        requestOptions
      );
      const data = await response.json();
      return data;
    } catch (err) {
      // if (axios.isAxiosError(err)) {
      //   let error = err;
      //   if (!error.response) {
      //     throw err;
      //   }
      //   return error.response.data;
      // }
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
