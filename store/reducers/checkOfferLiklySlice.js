import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../Api";

export const checkLiklyOfferRequest = createAsyncThunk(
  "check/favorite",
  async ({ token, id }) => {
    try {
      const result = await api.post("/check-likely-cat", {
        secret_token: token,
        last_id: id,
      });
      return result;
    } catch (error) {
      return;
      return error;
    }
  }
);

const checkLiklyOfferSlice = createSlice({
  name: "checkfavorite",
  initialState: {
    loading: false,
    error: false,
    data: [],
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(checkLiklyOfferRequest.pending, (state) => {
        state.loading = true;
      })

      .addCase(checkLiklyOfferRequest.fulfilled, (state, action) => {
        state.data = action.payload;
        state.error = false;
      })
      .addCase(checkLiklyOfferRequest.rejected, (state) => {
        state.error = true;
        state.loading = false;
      });
  },
});

export default checkLiklyOfferSlice.reducer;
