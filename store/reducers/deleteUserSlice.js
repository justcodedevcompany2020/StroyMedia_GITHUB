import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../Api";

export const deleteUserRequest = createAsyncThunk(
  "delete",
  async ({ token }) => {
    api
      .post("/delete-user-data", { secret_token: token })
      .then((res) => {
        return res;
      })
      .catch((error) => {
        return error.message;
      });
  }
);
const deletUserSlice = createSlice({
  name: "deletUser",
  initialState: {
    loading: false,
    error: false,
    data: "",
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(deleteUserRequest.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteUserRequest.fulfilled, (state, action) => {
        state.error = false;
      })
      .addCase(deleteUserRequest.rejected, (state) => {
        state.error = true;
        state.loading = false;
      });
  },
});

export default deletUserSlice.reducer;
