import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../Api";

export const editUserDataRequest = createAsyncThunk(
  "etidData",
  async (data) => {
    try {
      const response = await fetch("https://teus.online/api/edit-user-data", {
        method: "POST",
        headers: { "Content-Type": "multipart/form-data" },
        body: data,
      });
      const result = await response.json();

      return result;
    } catch (err) {
      throw err;
    }
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
