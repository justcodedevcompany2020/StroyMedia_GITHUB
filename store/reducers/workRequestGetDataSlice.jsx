import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../../Api";

export const workRequestGetDataRequest = createAsyncThunk(
  "work-request-get-data",
  async (data) => {
    console.log(data);
    try {
      const result = await fetch(
        "https://teus.online/api/work-request-get-data",
        {
          method: "POST",
          body: data,
        }
      );
      const data = await result.json();
      console.log(data, "result");
      return result;
    } catch (error) {
      console.log(error);
      return error;
    }
  }
);

const workRequestGetDataSlice = createSlice({
  name: "work-request-get-data",
  initialState: {
    loading: false,
    error: false,
    work_request_data: [],
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(workRequestGetDataRequest.pending, (state) => {
        state.loading = true;
      })

      .addCase(workRequestGetDataRequest.fulfilled, (state, action) => {
        // const data = Object.values(action.payload.data?.data.rows).map(
        //   (row) => {
        //     // console.log(row);
        //     return row;
        //   }
        // );
        console.log(action.payload.data, "action.payload.data");
        state.notification_data = data;
        // state.notification_data = action.payload.data?.data.rows;
        state.error = false;
      })

      .addCase(workRequestGetDataRequest.rejected, (state) => {
        state.error = true;
        state.loading = false;
      });
  },
});

export default workRequestGetDataSlice.reducer;
