import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../Api";

export const getHelpsQueryRequest = createAsyncThunk(
  "get/questions",
  async () => {
    try {
      const result = await api.post("/get-helps-data");
      return result;
    } catch (error) {
      return error;
    }
  }
);
const getHelpsSlice = createSlice({
  name: "questions",
  initialState: {
    loading: false,
    error: false,
    data: [],
  },
  reducers: {},
  extraReducers: (builder) => {
    builder

      .addCase(getHelpsQueryRequest.pending, (state) => {
        state.loading = true;
      })

      .addCase(getHelpsQueryRequest.fulfilled, (state, action) => {
        state.data = action.payload.data.data.posts.rows;
        state.loading = false;
      })

      .addCase(getHelpsQueryRequest.rejected, (state) => {
        state.loading = false;
      });
  },
});

export default getHelpsSlice.reducer;
