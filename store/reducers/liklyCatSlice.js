import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../Api";

export const getLiklyCatRequest = createAsyncThunk(
  "set/liklycat",
  async ({ token, id }) => {
    try {
      const result = await api.post("/add-likely-cat", {
        secret_token: token,
        last_id: id,
      });
      return result;
    } catch (error) {
      return error;
    }
  }
);

const getLiklyCatSlice = createSlice({
  name: "likly/cat",
  initialState: {
    loading: false,
    error: false,
    data: [],
  },
  reducers: {},
  extraReducers: (builder) => {
    builder

      .addCase(getLiklyCatRequest.pending, (state) => {
        state.loading = true;
      })

      .addCase(getLiklyCatRequest.fulfilled, (state, action) => {
        state.data = action.payload;
        state.loading = false;
      })

      .addCase(getLiklyCatRequest.rejected, (state) => {
        state.loading = false;
      });
  },
});

export default getLiklyCatSlice.reducer;
