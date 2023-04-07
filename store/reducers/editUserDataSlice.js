import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../Api";

export const editUserDataRequest = createAsyncThunk(
  "etidData",
  async (data) => {
    const result = await api.post("/edit-user-data", data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return result;
  }
);

const editUserSlice = createSlice({
  name: "edit",
  initialState: {
    loading: false,
    error: false,
    data: [],
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(editUserDataRequest.pending, (state) => {
        state.loading = true;
      })

      .addCase(editUserDataRequest.fulfilled, (state, action) => {
        state.posts = action.payload;
        state.loading = false;
      })

      .addCase(editUserDataRequest.rejected, (state) => {
        state.loading = false;
      });
  },
});

export default editUserSlice.reducer;
