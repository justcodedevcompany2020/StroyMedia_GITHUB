import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../Api";

export const getAnswerRequest = createAsyncThunk(
  "get/answerPolls",
  async ({ token, id, answer }) => {
    try {
      const result = await api.post("/send-answer-polls", {
        secret_token: token,
        poll_id: id,
        ids: [answer],
      });
      return result;
    } catch (error) {
      return error;
    }
  }
);
const getAnswerSlice = createSlice({
  name: "answerPolls",
  initialState: {
    loading: false,
    error: false,
    data: [],
  },
  reducers: {},
  extraReducers: (builder) => {
    builder

      .addCase(getAnswerRequest.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAnswerRequest.fulfilled, (state, action) => {
        state.data = action.payload.data.data.rows;
        state.loading = false;
      })

      .addCase(getAnswerRequest.rejected, (state) => {
        state.loading = false;
      });
  },
});

export default getAnswerSlice.reducer;
