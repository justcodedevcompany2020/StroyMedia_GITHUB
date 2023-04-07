import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../Api";

export const membersSingleRequest = createAsyncThunk(
  "member",
  async ({ token, id }) => {
    try {
      const result = await api.post("/get-member-single-data", {
        secret_token: token,
        company_id: id,
      });
      return result;
    } catch (error) {
      return error;
    }
  }
);

const membersSingleSlice = createSlice({
  name: "membersSibgle",
  initialState: {
    loading: false,
    error: false,
    data: [],
  },
  reducers: {},
  extraReducers: (builder) => {
    builder

      .addCase(membersSingleRequest.pending, (state) => {
        state.loading = true;
      })

      .addCase(membersSingleRequest.fulfilled, (state, action) => {
        state.data = action.payload?.data?.data?.company;
        state.error = false;
      })

      .addCase(membersSingleRequest.rejected, (state) => {
        state.error = true;
        state.loading = false;
      });
  },
});

export default membersSingleSlice.reducer;
