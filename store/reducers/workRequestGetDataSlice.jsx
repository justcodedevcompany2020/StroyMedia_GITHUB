import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";

export const workRequestGetDataRequest = createAsyncThunk(
  "work-request-get-data",
  async (
    form_data
  ) => {

    try {

      let requestOptions = {
        method: "POST",
        body: form_data,
      };
      const result = await fetch("https://teus.online/api/work-request-get-data", requestOptions)
      const data = await result.json();

      return data;
    } catch (error) {
      console.log(error)
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
        // console.log(row);
        //     return row;
        //   }
        // );
        // if (action.payload.message == "Successfully data got") {
        state.work_request_data = action.payload.data;
        // }
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
