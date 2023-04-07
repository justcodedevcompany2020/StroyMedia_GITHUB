import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../Api";

export const workRequest = createAsyncThunk("work/request", async (data) => {
  try {
    const result = await api.post("/work-request-send", data);
    return result;
  } catch (error) {
    return error;
  }
});
const workRequestSlice = createSlice({
  name: "work/request",
  initialState: {
    loading: false,
    error: false,
    data: [],
  },
  reducers: {},
  extraReducers: (builder) => {
    builder

      .addCase(workRequest.pending, (state) => {
        state.loading = true;
      })
      .addCase(workRequest.fulfilled, (state, action) => {
        state.data = action.payload;
        state.error = false;
        state.loading = false;
      })

      .addCase(workRequest.rejected, (state) => {
        state.error = true;
        state.loading = false;
      });
  },
});

export default workRequestSlice.reducer;
