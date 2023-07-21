import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const workRequestCancelRequest = createAsyncThunk(
  "work-request-cancel",
  async ({ secret_token, last_id, comment_id }) => {
    console.log(data);
    try {
      let formdata = new FormData();
      formdata.append("comment_id", comment_id);
      formdata.append("last_id", last_id);
      formdata.append("secret_token", secret_token);

      let requestOptions = {
        method: "POST",
        body: formdata,
        redirect: "follow",
      };
      const result = await fetch(
        "https://teus.online/api/work-request-cancel",
        requestOptions
      );

      const data = await result.json();
      console.log(data);
      return data;
    } catch (error) {
      return error;
    }
  }
);

const workRequestCancelSlice = createSlice({
  name: "work-request-cancel",
  initialState: {
    loading: false,
    error: false,
    work_request_data: [],
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(workRequestCancelRequest.pending, (state) => {
        state.loading = true;
      })

      .addCase(workRequestCancelRequest.fulfilled, (state, action) => {
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

      .addCase(workRequestCancelRequest.rejected, (state) => {
        state.error = true;
        state.loading = false;
      });
  },
});

export default workRequestCancelSlice.reducer;
