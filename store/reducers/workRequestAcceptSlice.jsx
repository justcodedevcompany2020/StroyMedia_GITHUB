import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const workRequestAcceptRequest = createAsyncThunk(
  "work-request-accept",
  async (data) => {
    console.log(data);
    try {
      let myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

  

      let requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: data,
        redirect: "follow",
      };

      const result = await fetch(
        "https://teus.online/api/work-request-accept",
        requestOptions
      );
      const data = await result.json();

      return data;
    } catch (error) {
      return error;
    }
  }
);

const workRequestAcceptSlice = createSlice({
  name: "work-request-accept",
  initialState: {
    loading: false,
    error: false,
    work_request_data: [],
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(workRequestAcceptRequest.pending, (state) => {
        state.loading = true;
      })

      .addCase(workRequestAcceptRequest.fulfilled, (state, action) => {
        // const data = Object.values(action.payload.data?.data.rows).map(
        //   (row) => {
        // console.log(row);
        //     return row;
        //   }
        // );
        if (action.payload.message == "Successfully data got") {
          state.work_request_data = action.payload.data;
        }
        // state.notification_data = action.payload.data?.data.rows;
        state.error = false;
      })

      .addCase(workRequestAcceptRequest.rejected, (state) => {
        state.error = true;
        state.loading = false;
      });
  },
});

export default workRequestAcceptSlice.reducer;
