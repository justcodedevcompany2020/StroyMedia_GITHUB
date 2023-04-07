import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../Api";
import axios from "axios";

export const allDialogRequest = createAsyncThunk(
  "all/dialog",
  async ({ token }) => {
    try {
      const result = await api.post("/auth-chat-dialog-all", {
        secret_token: token,
      });

      return result;
    } catch (err) {
      if (axios.isAxiosError(err)) {
        let error = err;
        if (!error.response) {
          throw err;
        }
        return rejectWithValue(error.response.data);
      }
      throw err;
    }
  }
);

const allDialogSlice = createSlice({
  name: "dialog",
  initialState: {
    loading: false,
    error: false,
    data: [],
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(allDialogRequest.pending, (state) => {
        state.loading = true;
      })
      .addCase(allDialogRequest.fulfilled, (state, action) => {
        state.data = action.payload.data.data.users;
        state.error = false;
        state.loading = false;
      })
      .addCase(allDialogRequest.rejected, (state) => {
        state.error = true;
        state.loading = false;
      });
  },
});

export default allDialogSlice.reducer;
