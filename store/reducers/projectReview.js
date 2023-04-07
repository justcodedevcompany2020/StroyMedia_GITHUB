import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../Api";

export const projectReviewRequest = createAsyncThunk(
  "project/review",
  async ({ token, id, rate, review }) => {
    try {
      const result = await api.post("/send-project-review", {
        secret_token: token,
        project_id: id,
        ball: rate,
        review: review,
      });
      return result;
    } catch (error) {
      return error;
    }
  }
);

const projectReviewSlice = createSlice({
  name: "projectReview",
  initialState: {
    loading: false,
    error: false,
    data: [],
  },
  reducers: {},
  extraReducers: (builder) => {
    builder

      .addCase(projectReviewRequest.pending, (state) => {
        state.loading = true;
      })
      .addCase(projectReviewRequest.fulfilled, (state, action) => {
        state.data = action.payload;
        state.error = false;
      })

      .addCase(projectReviewRequest.rejected, (state) => {
        state.error = true;
        state.loading = false;
      });
  },
});

export default projectReviewSlice.reducer;
