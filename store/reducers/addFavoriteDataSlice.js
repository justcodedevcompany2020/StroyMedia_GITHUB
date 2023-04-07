import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../Api";

export const addFavoriteRequest = createAsyncThunk(
  "addFavorite",
  async ({ token, id }) => {
    // console.log(id);
    try {
      const result = await api.post("/add-favorite-data", {
        secret_token: token,
        company_id: id,
      });

      console.log(result.data);
      return result.data;
    } catch (error) {
      return error;
    }
  }
);

const addFavoriterSlice = createSlice({
  name: "addFavorite",
  initialState: {
    loading: false,
    error: false,
    data: {},
  },

  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addFavoriteRequest.pending, (state) => {
        state.loading = true;
      })
      .addCase(addFavoriteRequest.fulfilled, (state, action) => {
        console.log(action.payload);
        state.data = action.payload;
        state.error = false;
      })
      .addCase(addFavoriteRequest.rejected, (state) => {
        state.error = true;
        state.loading = false;
      });
  },
});

export default addFavoriterSlice.reducer;
