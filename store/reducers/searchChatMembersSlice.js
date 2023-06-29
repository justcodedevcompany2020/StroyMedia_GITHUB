import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../Api";

export const searchMembersRequest = createAsyncThunk(
  "search/members",
  async (data) => {
    try {
      const result = await api.post("/chat-search-contact", data);
      return result;
    } catch (error) {
      return error;
    }
  }
);

const searchMembersSlice = createSlice({
  name: "search/members",
  initialState: {
    loading: false,
    error: false,
    data: [],
    success: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder

      .addCase(searchMembersRequest.pending, (state) => {
        state.loading = true;
      })
      .addCase(searchMembersRequest.fulfilled, (state, action) => {
        state.data = action.payload?.data?.data?.users;
        state.error = false;
        state.success = action.payload?.data?.success;
      })

      .addCase(searchMembersRequest.rejected, (state) => {
        state.error = true;
        state.loading = false;
      });
  },
});

export default searchMembersSlice.reducer;
