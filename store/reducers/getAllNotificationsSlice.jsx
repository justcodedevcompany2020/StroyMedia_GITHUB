import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../../Api";

export const getAllNotificationsRequest = createAsyncThunk(
  "get/polls",
  async ({ token }) => {
    try {
      const result = await api.post("/get-notify-all", {
        secret_token: token,
      });

      return result;
    } catch (error) {
      return error;
    }
  }
);

const getAllNotificationsSlice = createSlice({
  name: "polls",
  initialState: {
    loading: false,
    error: false,
    notification_data: [],
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllNotificationsRequest.pending, (state) => {
        state.loading = true;
      })

      .addCase(getAllNotificationsRequest.fulfilled, (state, action) => {
        const data = Object.values(action.payload.data?.data.rows).map(
          (row) => {
            // console.log(row);
            return row;
          }
        );
        // console.log(data)
        state.notification_data = data;
        // state.notification_data = action.payload.data?.data.rows;
        state.error = false;
      })

      .addCase(getAllNotificationsRequest.rejected, (state) => {
        state.error = true;
        state.loading = false;
      });
  },
});

export default getAllNotificationsSlice.reducer;
