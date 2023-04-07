import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../Api";

export const getAllPollsRequest = createAsyncThunk(
  "get/polls",
  async ({ token }) => {
    try {
      const result = await api.post("/get-all-polls", { secret_token: token });
      return result;
    } catch (error) {
      return error;
    }
  }
);

const getAllPollsSlice = createSlice({
  name: "polls",
  initialState: {
    loading: false,
    error: false,
    data: [],
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllPollsRequest.pending, (state) => {
        state.loading = true;
      })

      .addCase(getAllPollsRequest.fulfilled, (state, action) => {
        state.data = action.payload.data?.data.rows;
        state.error = false;
      })

      .addCase(getAllPollsRequest.rejected, (state) => {
        state.error = true;
        state.loading = false;
      });
  },
});

export default getAllPollsSlice.reducer;
