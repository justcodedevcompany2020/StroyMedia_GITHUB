import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";

export const workRequestAcceptRequest = createAsyncThunk(
  "work-request-accept",
  async ({secret_token, last_id, comment_id}) => {
    try {
      var formdata = new FormData();
      formdata.append("comment_id", comment_id);
      formdata.append("last_id", last_id);
      formdata.append("secret_token", secret_token);

      let requestOptions = {
        method: "POST",
        body: formdata,
        redirect: "follow",
      };
      const result = await fetch(
        "https://teus.online/api/work-request-accept",
        requestOptions
      );
      const data = await result.json();
      console.log(data)
      return data;
    } catch (error) {
      console.log(error);
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
