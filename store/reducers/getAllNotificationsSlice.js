import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../Api";

export const getAllnotificationsRequest = createAsyncThunk(
  "get/notifications",
  async ({ token }) => {
    try {
      const result = await api.post("/get-notify-all", { secret_token: token });
      return result;
    } catch (error) {
      return error;
    }
  }
);

const getAllNotificationsSlice = createSlice({
  name: "notifications",
  initialState: {
    loading: false,
    error: false,
    data: [],
  },
  reducers: {},
  extraReducers: (builder) => {
    builder

      .addCase(getAllnotificationsRequest.pending, (state) => {
        state.loading = true;
      })

      .addCase(getAllnotificationsRequest.fulfilled, (state, action) => {
        state.data = action.payload.data?.data?.rows;
        state.error = false;
      })

      .addCase(getAllnotificationsRequest.rejected, (state) => {
        state.error = true;
        state.loading = false;
      });
  },
});

export default getAllNotificationsSlice.reducer;
