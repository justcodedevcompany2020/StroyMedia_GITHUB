import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../Api";
import axios from "axios";

export const allCatRequest = createAsyncThunk(
  "allCat",
  async ({ token, tab, offset }) => {
    try {
      const result = await api.post("/cat-request-all", {
        secret_token: token,
        type_request: tab === "В работе" ? "onwork" : "draft",
        // offset,
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

const allCatSlice = createSlice({
  name: "allCat",
  initialState: {
    loading: false,
    error: false,
    data: [],
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(allCatRequest.pending, (state) => {
        state.loading = true;
      })
      .addCase(allCatRequest.fulfilled, (state, action) => {
        state.data = action.payload.data.data.aplications.aplications;
        state.error = false;
      })
      .addCase(allCatRequest.rejected, (state) => {
        state.error = true;
        state.loading = false;
      });
  },
});

export default allCatSlice.reducer;
